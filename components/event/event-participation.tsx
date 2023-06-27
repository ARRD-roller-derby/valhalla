import { useEvent, useEvents } from '@/entities'
import { QuestionIcon } from '@/ui'
import { Loader } from '@/ui/Loader'
import { PARTICIPATION_TYPES, dc, participationTypes } from '@/utils'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

export function EventParticipation() {
  const { loadingEvent, changeMyParticipation } = useEvents()
  const { event } = useEvent()
  const { data: session } = useSession()
  const roles = session?.user?.roles.map((role) => role.name.toLocaleLowerCase()) || []
  const myParticipation = useMemo(() => {
    const participation = event?.participants.find((part) => part.userId === session?.user?.id)
    if (!participation || participation?.type === 'absent.e')
      return { label: 'Je serais ', status: 'absent.e', type: 'absent.e' }

    return {
      ...participation,
      label:
        participation.status === 'à confirmer' ? 'Je serai peut-être présent en tant que ' : 'Je serai en tant que',
    }
  }, [event])

  if (loadingEvent === event._id)
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    )

  if (dayjs(event.end).isBefore(dayjs())) return null
  return (
    <div className="mt-2 fill-arrd-highlight">
      <div className="flex justify-end gap-2">
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
                  <QuestionIcon className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-arrd-primary fill-white p-1" />
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
