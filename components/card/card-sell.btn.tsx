import { useCard } from '@/entities'
import { Button, DragonIcon, Modal } from '@/ui'
import { useId, useState } from 'react'
import validator from 'validator'

export function CardSellBtn() {
  const id = useId()
  const { card, loadingSell, sellCard } = useCard()

  const [cost, setCost] = useState(card?.cost ? `${card.cost}` : '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInt = parseInt(e.target.value)
    if (isNaN(valueInt) && e.target.value.length > 0) return
    setCost(e.target.value)
  }

  const handleSell = async (onClose: () => void) => {
    const numCost = parseInt(cost)
    await sellCard(numCost ? numCost : 0)
    onClose()
  }

  const handleCancelSell = async (onClose: () => void) => {
    await sellCard(0)
    setCost('0')
    onClose()
  }

  if (!card) return null
  return (
    <Modal
      title={`Mettre la carte sur le marché`}
      button={(onClick) => (
        <div className="mt-1 cursor-pointer text-right text-sm text-arrd-highlight" onClick={onClick}>
          {card.cost ? `Modifier le prix de vente (${cost}dr)` : 'Mettre en vente'}
        </div>
      )}
    >
      {(onClose) => (
        <div className="flex max-h-[75vh] flex-col  gap-4 overflow-auto p-3">
          <div className="flex flex-col items-center justify-center gap-3">
            <label htmlFor={id}>
              Vendre la carte {':'}{' '}
              <span className="text-arrd-highlight">
                {card.question ? `"${validator.unescape(card.question)}"` : card.player?.name}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input type="number" id={id} name={id} className="input" onChange={handleChange} value={cost} autoFocus />
              <DragonIcon className="fill-arrd-primary" />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Button text="Vendre" type="secondary" onClick={() => handleSell(onClose)} loading={loadingSell} />
            {card.cost > 0 && (
              <Button text="Annuler la vente" type="primary" onClick={() => handleCancelSell(onClose)} />
            )}
            <Button text="Annuler" type="primary" onClick={onClose} />
          </div>
        </div>
      )}
    </Modal>
  )
}
