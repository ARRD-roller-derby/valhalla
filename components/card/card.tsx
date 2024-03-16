import { useCard } from '@/entities'
import { Card as ICard } from '@/models'
import { BoltIcon, CardUI, DragonIcon, EpicIcon, GameIcon, LegendaryIcon, RareIcon } from '@/ui'

import { getResume } from '@/utils/get-resume'
import { useMemo } from 'react'
import validator from 'validator'
import { CardSellBtn } from './card-sell.btn'
import { CardBuyBtn } from './card-buy.btn'

interface CardProps {
  isInSell?: boolean
}
export function Card({ isInSell = false }: CardProps) {
  const { card } = useCard()

  const infos = useMemo(() => {
    if (!card) return {} as ICard & { isUsed: boolean; name: string }
    const infos = {
      ...card,
      isUsed: false,
      name: '',
    }
    if (card.player) {
      infos.isUsed = card.player.isInTeam || false
      infos.name = card.player.name
    }
    if (card.question) {
      infos.isUsed = !!card.flash?.lastRevision
      infos.name = getResume(card.question, 30)
    }

    return infos
  }, [card])

  if (!card) return null
  return (
    <CardUI>
      <div className="flex h-full flex-col justify-between gap-2">
        <div className="flex  gap-2">
          <div className="text-arrd-primary">{validator.unescape(infos.name)}</div>
          <div className="flex gap-1">
            <div className="fill-arrd-highlight">
              {infos.rarity === 'rare' && <RareIcon />}
              {infos.rarity === 'epic' && <EpicIcon />}
              {infos.rarity === 'legendary' && <LegendaryIcon />}
            </div>
            <div className="fill-arrd-highlight">{!!infos.question ? <BoltIcon /> : <GameIcon />}</div>
          </div>
        </div>
        {infos.question && (
          <div className="flex-1 text-center text-sm text-arrd-text">{validator.unescape(infos.question)}</div>
        )}
        {infos.player && (
          <div className="flex flex-col gap-1 text-sm">
            <div>
              <div>
                <span>Cardio: </span>
                <strong>{infos.player.stamina}</strong>
              </div>
              <div>
                <span>Récupération: </span>
                <strong>{infos.player.recovery}</strong>
              </div>
              <div>
                <span>Vitesse: </span>
                <strong>{infos.player.speed}</strong>
              </div>
              <div>
                <span>Esquive: </span>
                <strong>{infos.player.dodge}</strong>
              </div>
              <div>
                <span>Blocage: </span>
                <strong>{infos.player.block}</strong>
              </div>

              <div>
                <span>Assist: </span>
                <strong>{infos.player.assistance}</strong>
              </div>
            </div>
          </div>
        )}
        {infos.isUsed && <div className="text-arrd-primary">Utilisée</div>}
        {isInSell && (
          <div className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 text-center text-sm text-arrd-highlight">
            Acheter pour <span className="font-bold">{card.cost}</span>
            <DragonIcon className="fill-arrd-primary" />
          </div>
        )}
        {!isInSell && <CardSellBtn />}
      </div>
    </CardUI>
  )
}
