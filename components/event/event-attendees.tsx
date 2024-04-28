// Bibliothèques externes
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { HandIcon, Loader } from '@/ui'
import { useEvent, useEvents } from '@/entities'
import { dc, participationTypes } from '@/utils'

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
  // Stores --------------------------------------------------------------------
  const { data: session } = useSession()
  const { participants, fetchParticipation } = useEvents()

  // States --------------------------------------------------------------------
  const [loading, setLoading] = useState(false)

  // Hooks ---------------------------------------------------------------------
  const { event } = useEvent()

  // Constantes ---------------------------------------------------------------
  const presentCount = participants.filter((p) => !p.type.match(/absent/)).length
  const hasConfirmedCount = participants.filter((p) => p.status === 'à confirmer').length

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
        <div></div>
      </div>
      {loading && (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}
      <div className="m-auto flex max-w-[500px] justify-center">
        <div className="flex flex-col gap-2">
          {participants.sort(compareParticipants).map((p: any) => {
            const icon = participationTypes.find((pType) => pType.key === p.type)?.icon || <HandIcon />
            return (
              <div
                key={p.name}
                className={dc('flex items-center  gap-2 rounded border border-arrd-bgLight p-2', [
                  !!p.type.match(/absent/),
                  'opacity-50',
                ])}
              >
                <div className="">{p.avatar && <img src={p.avatar} className="h-12 w-12 rounded-full" />}</div>

                <div className="flex-1 text-right font-bold first-letter:uppercase">
                  {p.name}
                  <div className="flex items-center  justify-end gap-1 text-right text-xs  italic text-arrd-primary ">
                    <div className="flex w-3 items-center justify-center fill-arrd-highlight">{icon}</div>
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
