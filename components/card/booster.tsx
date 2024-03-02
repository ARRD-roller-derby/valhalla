import { useCards } from '@/entities/card.store'
import { Card as ICard } from '@/models/card.model'
import { Button, Card, DragonIcon, Modal } from '@/ui'
import { dc } from '@/utils'
import { Booster } from '@/utils/boosters'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { PreviewCard } from './Preview-Card'

type BoosterProps = {
  booster: Booster
}

export function Booster({ booster }: BoosterProps) {
  const { data: session } = useSession()
  const { buyBooster, error, loading } = useCards()
  const [cards, setCards] = useState<ICard[]>([])

  const wallet = session?.user.wallet || 0
  const isDisabled = wallet < booster.cost

  const handleBuy = async () => {
    setCards([])
    try {
      setCards(await buyBooster(booster.key))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      title={`Achat`}
      button={(onClick) => (
        <Card key={booster.key}>
          <div
            className={dc('flex  flex-col gap-1', [isDisabled, 'pointer-events-none opacity-50', 'cursor-pointer'])}
            onClick={() => onClick()}
          >
            <header className="font-bold uppercase text-arrd-highlight">{booster.title}</header>
            <div className="text-sm italic">{booster.description}</div>
            <div className="flex items-center gap-1 self-end font-bold text-arrd-primary">
              {booster.cost} <DragonIcon className="fill-arrd-primary" />
            </div>
            {isDisabled && <div className="text-arrd-primary">Solde insuffisant</div>}
          </div>
        </Card>
      )}
    >
      {(onClose) => (
        <div className="flex flex-col items-center gap-2 p-3">
          <div>Confirmer l'achat : {booster.title}</div>
          <div className="flex items-center gap-1 font-bold text-arrd-primary">
            Prix: {booster.cost} <DragonIcon className="fill-arrd-primary" />
          </div>
          {error && <div className="text-arrd-textError">{error}</div>}

          {cards.length > 0 && (
            <div className="text-xs text-arrd-highlight">
              {cards.length} cartes ajoutée{cards.length > 1 ? 's' : ''} à votre collection
            </div>
          )}
          {cards.length > 0 && (
            <div className="flex w-full flex-col gap-2 overflow-y-auto">
              {cards.map((card) => (
                <PreviewCard key={card._id.toString()} card={card} />
              ))}
            </div>
          )}
          <div className="flex w-full flex-wrap justify-between gap-2">
            <Button
              onClick={handleBuy}
              text={cards.length === 0 ? 'Acheter' : 'Acheter à nouveau'}
              type="secondary"
              loading={loading}
            />
            <Button onClick={onClose} text="Annuler" />
          </div>
        </div>
      )}
    </Modal>
  )
}
