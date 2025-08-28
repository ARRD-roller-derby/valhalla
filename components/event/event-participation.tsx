// Bibliothèques externes
import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

// Bibliothèques internes
import { TriggerTypes, useEvent, useEvents, useSocketTrigger } from '@/entities'
import { Button, Modal } from '@/ui'
import { Loader } from '@/ui/Loader'
import { dc, participationTypes } from '@/utils'
import { EventParticipationInfo } from './event-participation-info'
import { EventAttendeesModal } from './event-attendees.modal'

export function EventParticipation() {
  // Stores -----------------------------------------------------
  const { events, loadingEvent, changeMyParticipation, changeMyParticipationStatus, syncParticipation } = useEvents()
  const { event } = useEvent()
  const { data: session } = useSession()

  // Hooks ------------------------------------------------------
  useSocketTrigger<{ eventId: ObjectId }>(TriggerTypes.PARTICIPATION, ({ eventId }) => {
    if (!session?.user) return
    if (event?._id === eventId) syncParticipation(event._id)
  })

  // Constantes -------------------------------------------------
  const roles = useMemo(() => {
    if (!session?.user) return ['membre']
    return session?.user?.roles.map((role) => role.name.toLocaleLowerCase()) || []
  }, [session])

  const { myParticipation, participationTypesCount } = useMemo<{
    participationTypesCount: { [key: string]: number }
    myParticipation: { label: string; type: string; btn: boolean }
  }>(() => {
    const participation = event?.participants.find((part) => part.userId === session?.user?.id)
    const participationTypesCount = participationTypes
      .map((pType) => ({
        key: pType.key,
        count: event?.participants.filter((part) => part.type.replace(/[·.]/, '') === pType.key.replace(/[·.]/, ''))
          .length,
      }))
      .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.count }), {})

    if (!participation)
      return {
        participationTypesCount,
        myParticipation: { label: "Je n'ai pas encore", type: 'répondu', btn: false },
      }

    if (participation?.type.match(/absent/))
      return {
        participationTypesCount,
        myParticipation: { label: 'Je serai ', type: 'absent·e', btn: false },
      }

    return {
      participationTypesCount,
      myParticipation: {
        ...participation,
        btn: true,
        label: 'Je serai ',
      },
    }
  }, [event, events])

  // Rendu ------------------------------------------------------

  if (dayjs(event.end).isBefore(dayjs()))
    return (
      <div className="flex h-full w-full items-end justify-center">
        <div className="flex-1 rounded-sm border border-arrd-textError p-2 text-center text-arrd-textError">
          Terminé
        </div>
      </div>
    )
  return (
    <div className="mr-1 mt-2 fill-arrd-highlight">
      <div className="flex justify-between gap-3">
        <div>
          <EventParticipationInfo />
        </div>
        <div className="flex gap-3 pr-1">
          {loadingEvent === event._id ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            participationTypes
              .filter((pType) => pType?.roles?.some((role) => roles.includes(role)))
              .filter((pType) => pType?.type?.includes(event?.type))
              .map((pType) => (
                <div
                  key={pType.key}
                  className={dc('relative  p-1', [
                    myParticipation.type === pType.key,
                    'pointer-events-none flex items-center justify-center rounded-full fill-white ring ring-arrd-primary',
                    'cursor-pointer',
                  ])}
                  onClick={() => changeMyParticipation(event._id, pType.key)}
                >
                  {pType.icon}
                  {participationTypesCount[pType.key] > 0 && (
                    <div className="absolute -right-2 -top-1  flex h-4 w-4 items-center justify-center rounded-full bg-arrd-primary p-1 text-xs text-white">
                      {participationTypesCount[pType.key]}
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
      <div className="mt-1 flex flex-1 flex-col justify-between gap-3">
        <div className="p-1 text-right text-xs italic">
          {myParticipation.label} <span className="font-bold">{myParticipation.type}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Modal
            title="Liste des participants"
            button={(onClick) => <Button onClick={onClick} type="invert-secondary" text="participants" />}
          >
            {() => <EventAttendeesModal />}
          </Modal>
        </div>
      </div>
    </div>
  )
}
