import { Card } from '@/models/card.model'
import { getResume } from '../../utils/get-resume'
import { dc } from '@/utils'
import validator from 'validator'
import { BoltIcon } from '@/ui'
import { getRarity } from '@/utils/get-rarity'

type PreviewCardProps = {
  card: Card
}

export function PreviewCard({ card }: PreviewCardProps) {
  const isFlashcard = card.type === 'flashcard' && card.question
  return (
    <div
      className={dc('flex flex-col gap-2 rounded-md border bg-arrd-bgDark p-2 text-sm', [
        card.rarity === 'common',
        'border-arrd-secondary',
      ])}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-end gap-1 text-xs">
          {getRarity(card.rarity)}
          {isFlashcard && <BoltIcon className="h-5 fill-arrd-highlight" />}
        </div>
        {isFlashcard && <div>{getResume(validator.unescape(card?.question || ''))}</div>}
      </div>
    </div>
  )
}
