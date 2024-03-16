import { useCard } from '@/entities'
import { Button, CardUI, DragonIcon, Modal } from '@/ui'
import { useId } from 'react'
import { Card } from './card'
import { useSession } from 'next-auth/react'
import { dc } from '@/utils'

export function CardBuyBtn() {
  const { data: session } = useSession()
  const id = useId()
  const { card, loadingSell, buyCard } = useCard()

  const canBuy = (card?.cost || 0) <= (session?.user?.wallet || 0)

  const handleBuy = async (onClose: () => void) => {
    if (!canBuy) return
    await buyCard()
    onClose()
  }
  if (!card) return null
  return (
    <Modal
      title={`Acheter la carte`}
      button={(onClick) => (
        <div onClick={() => onClick()} className={dc('cursor-pointer', [!canBuy, 'opacity-50'])}>
          <Card isInSell />
        </div>
      )}
    >
      {(onClose) => (
        <div className="flex max-h-[75vh] flex-col  gap-4 overflow-auto p-3">
          <div className="flex flex-col items-center justify-center gap-3">
            <label htmlFor={id}>
              Acheter la carte {':'} <span className="text-arrd-highlight">{card.question || card.player?.name}</span>
            </label>
            <div className="flex items-center gap-2">
              pour {':'} {card.cost}
              <DragonIcon className="fill-arrd-primary" />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Button
              text="Acheter"
              type="secondary"
              onClick={() => handleBuy(onClose)}
              loading={loadingSell}
              disabled={!canBuy}
            />
            <Button text="Annuler" type="primary" onClick={onClose} />
          </div>
        </div>
      )}
    </Modal>
  )
}
