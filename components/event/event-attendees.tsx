// Bibliothèques externes
import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { Loader } from '@/ui'
import { useEvent, useEvents } from '@/entities'

// Modèles
import { IParticipant } from '@/models'
import { EventAttendeesDetails } from './event-attendees-details'

const order = ['coach', 'assist-coach', 'organizer', 'patineur.euse', 'visiteur.euse / NSO', 'invité.e', 'absent·e']

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
  // Stores --------------------------------------------------------------------
  const { data: session } = useSession()
  const { participants, fetchParticipation } = useEvents()

  // States --------------------------------------------------------------------
  const [loading, setLoading] = useState(false)

  // Hooks ---------------------------------------------------------------------
  const { event } = useEvent()

  // Constantes ---------------------------------------------------------------

  const { presentCount, hasConfirmedCount, absCount } = useMemo(() => {
    const presentCount = participants.filter((p) => !p.type.match(/absent/) && p.status !== 'à confirmer').length
    const hasConfirmedCount = participants.filter((p) => p.status === 'à confirmer').length
    const absCount = participants.filter((p) => p.type.match(/absent/)).length
    return { presentCount, hasConfirmedCount, absCount }
  }, [participants])

  // Fonctions ----------------------------------------------------------------
  const handleFetch = async () => {
    setLoading(true)
    await fetchParticipation(event._id)
    setLoading(false)
  }

  // Effets -------------------------------------------------------------------
  useEffect(() => {
    if (session?.user) handleFetch()
  }, [session])

  // Rendu --------------------------------------------------------------------
  return (
    <div className="mx-auto mt-2 flex  max-w-[300px] flex-col justify-center gap-3 p-3">
      {loading && (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}

      <div className="flex flex-col gap-1">
        {participants.length > 0 && (
          <div className="text-center text-arrd-highlight">
            {presentCount} présent·e{participants.length > 1 ? '·s' : ''}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {participants

            .filter((p) => !p.type.match(/absent/) && p.status !== 'à confirmer')
            .sort(compareParticipants)
            .map((p: any) => (
              <EventAttendeesDetails key={p.name} participant={p} />
            ))}
        </div>
      </div>

      {hasConfirmedCount > 0 && (
        <div className="flex flex-col gap-1">
          {hasConfirmedCount > 0 && (
            <div className="text-center text-arrd-highlight">
              {hasConfirmedCount} {'à confirmer'}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {participants
              .filter((p) => p.status === 'à confirmer')
              .sort(compareParticipants)
              .map((p: any) => (
                <EventAttendeesDetails key={p.name} participant={p} />
              ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        {absCount > 0 && (
          <div className="text-center text-arrd-highlight">
            {absCount} absent·e{absCount > 1 ? '·s' : ''}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {participants
            .filter((p) => p.type.match(/absent/))
            .sort(compareParticipants)
            .map((p: any) => (
              <EventAttendeesDetails key={p.name} participant={p} />
            ))}
        </div>
      </div>
    </div>
  )
}
