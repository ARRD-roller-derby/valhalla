import { Card } from '@/models/'
import { getResume, getRarity } from '@/utils/'
import { dc } from '@/utils'
import validator from 'validator'
import { BoltIcon, GameIcon } from '@/ui'

type PreviewCardProps = {
  card: Card
}

export function PreviewCard({ card }: PreviewCardProps) {
  const isFlashcard = card.type === 'flashcard' && card.question
  const isPlayer = card.type === 'player'
  return (
    <div
      className={dc(
        'flex flex-col gap-2 rounded-md border bg-arrd-bgDark p-2 text-sm',
        [card.rarity === 'common', 'border-arrd-secondary'],
        [card.rarity === 'rare', 'border-arrd-accent'],
        [card.rarity === 'epic', 'border-arrd-highlight'],
        [card.rarity === 'legendary', 'border-arrd-textError']
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-end gap-1 text-xs">
          {getRarity(card.rarity)}
          {isFlashcard && <BoltIcon className="h-5 fill-arrd-highlight" />}
          {isPlayer && <GameIcon className="h-4 fill-arrd-highlight" />}
        </div>
        {isFlashcard && <div>{getResume(validator.unescape(card?.question || ''))}</div>}
        {isPlayer && card.player && (
          <div>
            <div>{card.player.name}</div>
          </div>
        )}
      </div>
    </div>
  )
}
