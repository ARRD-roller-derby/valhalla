// Bibliothèques externes
import { useEffect, useMemo, useState } from 'react'

// Bibliothèques internes
import { useEvent, useEvents } from '@/entities'
import { Button, DragonIcon, FooterModal, HandIcon, Modal } from '@/ui'
import { Loader } from '@/ui/Loader'
import { ROLES, checkRoles, dc, participationTypes } from '@/utils'
import { useSession } from 'next-auth/react'

// Modèles
import { IParticipant } from '@/models'

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

export function EventAttendees() {
  const [loading, setLoading] = useState(false)
  const { participants, fetchParticipation, spyParticipation } = useEvents()
  const { event } = useEvent()
  const { data: session } = useSession()
  const presentCount = participants.filter((p) => !p.status.match(/absent/)).length
  const hasConfirmedCount = participants.filter((p) => p.status === 'à confirmer').length
  const canSeeAttendees = useMemo(() => {
    if (!session?.user) return false
    if (participants.length === 0) return checkRoles([ROLES.bureau, ROLES.coach, ROLES.evenement], session?.user)
    return true
  }, [session])

  const handleFetch = async () => {
    setLoading(true)
    await fetchParticipation(event._id)
    setLoading(false)
  }
  useEffect(() => {
    if (session?.user) handleFetch()
  }, [session])

  const handleSpy = async () => {
    await spyParticipation(event._id)
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex justify-between">
        <div>
          {participants.length > 0 && (
            <div className="text-arrd-highlight">
              {presentCount} présent·e{participants.length > 1 ? '·s' : ''}
              {hasConfirmedCount > 0 && ` dont ${hasConfirmedCount} à confirmer`}
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
                  loading={loading}
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
      {loading && (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}
      <div className="m-auto flex max-w-[500px] justify-center">
        <div className="flex flex-col gap-2">
          {participants.sort(compareParticipants).map((p) => {
            const icon = participationTypes.find((pType) => pType.key === p.type)?.icon || <HandIcon />
            return (
              <div
                key={p.name}
                className={dc('flex items-center  gap-2 rounded border border-arrd-bgLight p-2', [
                  !!p.status.match(/absent/),
                  'opacity-50',
                ])}
              >
                <div className="h-6 w-6 fill-arrd-highlight">{icon}</div>
                <div className="font-bold first-letter:uppercase">
                  {p.name}
                  <div className="text-right text-xs italic text-arrd-primary">
                    {p.type} {p.status === 'à confirmer' ? '?' : ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
