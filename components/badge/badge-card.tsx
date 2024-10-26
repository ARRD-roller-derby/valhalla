import type { IBadge } from '@/entities'
import { BadgeIcon } from '@/ui'
import { ReadEditor } from '../editor'
import { BadgeCardStatus } from './badge-card-status'
import { BadgeDelete } from './badge-delete'
import { BadgeForm } from './badge-form'
import { BADGE_LEVELS } from '@/utils/badge-levels'
import { dc } from '@/utils'
import { useMemo } from 'react'

type BadgeProps = {
  badge: IBadge
}
export function BadgeCard({ badge }: BadgeProps) {
  const badgeLevel = BADGE_LEVELS.find((level) => level.value === badge.level)
  const Icon = badgeLevel?.icon || BadgeIcon
  const color = badgeLevel?.color || 'fill-arrd-primary'
  const borderColor = badgeLevel?.borderColor || 'border-arrd-primary'

  return (
    <div
      data-win={badge.win}
      className={dc(
        borderColor,
        'relative grid grid-cols-[auto_1fr] items-center gap-3 rounded-md border-2 p-2 transition-colors hover:border-amber-400  hover:opacity-100',
        'data-[win=false]:border-dashed  data-[color]:data-[win=false]:border-arrd-bgLight data-[win=false]:opacity-50 data-[win=false]:hover:opacity-100'
      )}
    >
      <div>
        <Icon className={dc('h-10 w-10', color)} />
      </div>
      <div>
        <div className={dc('text-lg first-letter:uppercase', color.replace('fill-', 'text-'))}>{badge.name}</div>
        <div className="text-xs text-arrd-textExtraLight">
          <ReadEditor content={badge.description} key={JSON.stringify(badge.description || '{}')} />
        </div>
        <div className="flex justify-end gap-3">
          <BadgeForm badge={badge} />
          <BadgeCardStatus badge={badge} />
        </div>
        <BadgeDelete badge={badge} />
      </div>
    </div>
  )
}
