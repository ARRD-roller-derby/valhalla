import { useEvent, useEvents } from '@/entities'
import { IParticipant } from '@/models'
import { Button, DragonIcon, FooterModal, HandIcon, Modal, SkaterIcon } from '@/ui'
import { Loader } from '@/ui/Loader'
import { ROLES, checkRoles, participationTypes } from '@/utils'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export function EventAttendees() {
  const { participants, loadingEvent, fetchParticipation, spyParticipation } = useEvents()
  const { event } = useEvent()
  const { data: session } = useSession()
  const user = session?.user
  const presentCount = participants.filter((p) => p.type !== 'absent.e').length

  if (!user) return null
  const canSeeAttendees = checkRoles([ROLES.bureau, ROLES.coach, ROLES.evenement], user)

  const handleSpy = async () => {
    await spyParticipation(event._id)
  }

  useEffect(() => {
    fetchParticipation(event._id)
  }, [])

  const order = ['coach', 'assist-coach', 'organizer', 'patineur.euse', 'visiteur.euse / NSO', 'invité.e', 'absent.e']

  // Fonction de comparaison pour trier les participants
  const compareParticipants = (participantA: IParticipant, participantB: IParticipant) => {
    const typeA = participantA.type
    const typeB = participantB.type

    const indexA = order.indexOf(typeA)
    const indexB = order.indexOf(typeB)

    // Trier en fonction de l'index dans le tableau d'ordre personnalisé
    if (indexA < indexB) {
      return -1
    } else if (indexA > indexB) {
      return 1
    } else {
      return 0
    }
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex justify-between">
        <div>
          {participants.length > 0 && (
            <div className="text-arrd-highlight">
              {presentCount} présent·e{participants.length > 1 ? '·s' : ''}
            </div>
          )}
        </div>
        <div>
          {!canSeeAttendees && (
            <Modal
              title={`Voir les participants`}
              button={(onClick) => (
                <Button
                  onClick={onClick}
                  text={participants.length === 0 ? 'Espionner' : 'rafraîchir'}
                  type="secondary"
                />
              )}
              footer={(close) => (
                <FooterModal
                  closeModal={close}
                  loading={loadingEvent === event._id}
                  txtConfirm={`Espionner pour 35 dr.`}
                  onConfirm={() => handleSpy()}
                />
              )}
            >
              {() => (
                <div className="p-4">
                  <p>Cette action vous permet de voir les participants à l'événement.</p>
                  <p>
                    Êtes-vous sûr de vouloir <span className="font-bold">Espionner</span>{' '}
                    <span className="text-arrd-highlight">{event.title}</span> ?
                  </p>
                  <div className="flex w-full flex-wrap gap-1 text-center italic">
                    Cette action vous coûtera <span className="font-bold text-arrd-highlight"> 35 </span>
                    <DragonIcon className="fill-arrd-highlight" />
                  </div>
                </div>
              )}
            </Modal>
          )}
        </div>
      </div>
      {loadingEvent === event._id && (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}
      <div className="m-auto flex max-w-[500px] justify-center">
        <div className="flex flex-col gap-2">
          {participants.sort(compareParticipants).map((p) => {
            const icon = participationTypes.find((pType) => pType.key === p.type)?.icon || <HandIcon />
            return (
              <div key={p.name} className="flex items-center  gap-2 rounded border border-arrd-bgLight p-2">
                <div className="h-6 w-6 fill-arrd-highlight">{icon}</div>
                <div className="font-bold first-letter:uppercase">
                  {p.name}
                  <div className="text-right text-xs italic text-arrd-primary">{p.type}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
