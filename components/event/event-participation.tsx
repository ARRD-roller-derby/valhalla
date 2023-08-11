// Bibliothèques externes
import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

// Bibliothèques internes
import { TriggerTypes, useEvent, useEvents, useSocketTrigger } from '@/entities'
import { QuestionIcon } from '@/ui'
import { Loader } from '@/ui/Loader'
import { PARTICIPATION_TYPES, dc, participationTypes } from '@/utils'
import { EventParticipationInfo } from './event-participation-info'

export function EventParticipation() {
  // stores
  const { events, loadingEvent, changeMyParticipation, syncParticipation } = useEvents()
  const { event } = useEvent()
  const { data: session } = useSession()

  // hooks
  useSocketTrigger<{ eventId: ObjectId }>(TriggerTypes.PARTICIPATION, ({ eventId }) => {
    if (!session?.user) return
    if (event?._id === eventId) syncParticipation(event._id)
  })

  // const
  const roles = useMemo(() => {
    if (!session?.user) return ['membre']
    return session?.user?.roles.map((role) => role.name.toLocaleLowerCase()) || []
  }, [session])

  const { myParticipation, participationTypesCount } = useMemo<{
    participationTypesCount: { [key: string]: number }
    myParticipation: { label: string; status: string; type: string }
  }>(() => {
    const participation = event?.participants.find((part) => part.userId === session?.user?.id)
    const participationTypesCount = participationTypes
      .map((pType) => ({
        key: pType.key,
        count: event?.participants
          .filter((part) => part.status !== 'à confirmer')
          .filter((part) => part.type === pType.key).length,
      }))
      .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.count }), {})

    if (!participation || participation?.type === 'absent.e')
      return {
        participationTypesCount,
        myParticipation: { label: 'Je serais ', status: 'absent.e', type: 'absent.e' },
      }

    return {
      participationTypesCount,
      myParticipation: {
        ...participation,
        label:
          participation.status === 'à confirmer' ? 'Je serai peut-être présent en tant que ' : 'Je serai en tant que',
      },
    }
  }, [event, events])

  // render
  if (loadingEvent === event._id)
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    )

  if (dayjs(event.end).isBefore(dayjs())) return <></>
  return (
    <div className="mr-1 mt-2 fill-arrd-highlight">
      <div className="flex justify-end gap-3 pr-1">
        <div onClick={() => console.log('JE DOIS AFFICHER LES LABEL ET EXPLICATION POUR CLICK')}>
          <EventParticipationInfo />
        </div>
        {participationTypes
          .filter((pType) => pType?.roles?.some((role) => roles.includes(role)))
          .filter((pType) => pType?.type?.includes(event?.type))
          .map((pType) => (
            <div
              key={pType.key}
              className={dc('relative cursor-pointer p-1', [
                myParticipation.type === pType.key,
                'rounded-full fill-white ring ring-arrd-primary',
              ])}
              onClick={() => changeMyParticipation(event._id, pType.key)}
            >
              {pType.icon}
              {myParticipation.type !== PARTICIPATION_TYPES.absent &&
                myParticipation.type === pType.key &&
                myParticipation.status === 'à confirmer' && (
                  <QuestionIcon className="absolute -bottom-1 -right-2 h-4 w-4 rounded-full bg-arrd-primary fill-white p-1" />
                )}
              {participationTypesCount[pType.key] > 0 && (
                <div className="absolute -right-2 -top-1  flex h-4 w-4 items-center justify-center rounded-full bg-arrd-primary p-1 text-xs text-white">
                  {participationTypesCount[pType.key]}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="p-2 text-right text-xs italic">
        {myParticipation.label} <span className="font-bold">{myParticipation.type}</span>
      </div>
    </div>
  )
}
