import { useCards } from '@/entities'
import { CardFlashRevisionMode } from '@/components'
import { Button, Loader } from '@/ui'
import { useEffect } from 'react'

export function CardFlashHome() {
  const { revisionMode, loadingRevision, numOfCardsForRevision, getFlashCard, setRevisionMode } = useCards()

  useEffect(() => {
    getFlashCard()
  }, [])

  if (revisionMode) return <CardFlashRevisionMode />
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 p-4">
        <div>
          {loadingRevision ? (
            <Loader />
          ) : (
            <div className="text-4xl font-bold text-arrd-highlight">{numOfCardsForRevision}</div>
          )}
        </div>
        <div>Carte{numOfCardsForRevision > 1 ? 's' : ''} à reviser</div>
      </div>
      <div className="flex w-full justify-center">
        <Button
          text="Commencer la révision"
          type="secondary"
          onClick={() => setRevisionMode(true)}
          disabled={numOfCardsForRevision === 0}
        />
      </div>
      <div className="italic">
        Bienvenue dans votre espace de révision ! Ici, vous pouvez interagir avec les cartes de votre collection de
        manière ludique et stratégique. Chaque session de révision est une opportunité de redécouvrir vos cartes, d'en
        apprendre plus sur leurs capacités et de renforcer votre stratégie pour les matchs à venir.
      </div>
    </div>
  )
}
