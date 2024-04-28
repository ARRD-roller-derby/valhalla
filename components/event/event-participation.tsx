// Bibliothèques externes
import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'

// Bibliothèques internes
import { TriggerTypes, useEvent, useEvents, useSocketTrigger } from '@/entities'
import { Button, Modal, QuestionIcon } from '@/ui'
import { Loader } from '@/ui/Loader'
import { PARTICIPATION_TYPES, dc, participationTypes } from '@/utils'
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
    myParticipation: { label: string; status: string; type: string; btn: boolean }
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

    if (!participation)
      return {
        participationTypesCount,
        myParticipation: { label: "Je n'ai pas encore", status: 'répondu', type: 'répondu', btn: false },
      }

    if (participation?.type === 'absent.e')
      return {
        participationTypesCount,
        myParticipation: { label: 'Je serais ', status: 'absent.e', type: 'absent.e', btn: false },
      }

    return {
      participationTypesCount,
      myParticipation: {
        ...participation,
        btn: true,
        label:
          participation.status === 'à confirmer' ? 'Je serai peut-être présent en tant que ' : 'Je serai en tant que',
      },
    }
  }, [event, events])

  // Rendu ------------------------------------------------------

  if (dayjs(event.end).isBefore(dayjs())) return <></>
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
                  className={dc('relative cursor-pointer p-1', [
                    myParticipation.type === pType.key,
                    'flex items-center justify-center rounded-full fill-white ring ring-arrd-primary',
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
            button={(onClick) => <Button onClick={onClick} type="secondary" text="participants" />}
          >
            {() => <EventAttendeesModal />}
          </Modal>
          {myParticipation.btn ? (
            <div
              className="flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-arrd-bg px-1 py-2 text-left text-xs text-white"
              onClick={() =>
                changeMyParticipationStatus(event._id, myParticipation.status === 'à confirmer' ? 'confirm' : 'maybe')
              }
            >
              <span className="first-letter:uppercase">
                {myParticipation.status === 'à confirmer' ? 'je confirme' : 'Je ne suis pas sûr.e'}
              </span>
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
