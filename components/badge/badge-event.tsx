import type { IBadge } from '@/entities'
import { BadgeIcon } from '@/ui'
import { ReadEditor } from '../editor'
import { BADGE_LEVELS } from '@/utils/badge-levels'
import { dc } from '@/utils'
import { BadgeCardStatus } from './badge-card-status'

type BadgeEventProps = {
  badge: IBadge & { participants?: { name: string; providerAccountId: string; _id: string; haveBadge: boolean }[] }
}
export function BadgeEvent({ badge }: BadgeEventProps) {
  const badgeLevel = BADGE_LEVELS.find((level) => level.value === badge.level)
  const Icon = badgeLevel?.icon || BadgeIcon
  const color = badgeLevel?.color || 'fill-arrd-primary'
  const borderColor = badgeLevel?.borderColor || 'border-arrd-primary'

  return (
    <div
      className={dc(
        borderColor,
        'relative grid grid-cols-[auto_1fr] items-center gap-3 rounded-md border-2 p-2 transition-colors hover:border-amber-400  hover:opacity-100'
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
      </div>
      <div className="col-span-full flex max-h-[200px] flex-col gap-4 overflow-y-auto p-2">
        {badge?.participants
          ?.filter((p) => !p.haveBadge)
          .map((participant) => (
            <div
              key={participant._id}
              className="grid grid-cols-[2fr_1fr] items-center gap-2 border-b border-arrd-bgLight pb-2"
            >
              <div className="text-sm">{participant.name}</div>
              <BadgeCardStatus badge={badge} providerAccountId={participant.providerAccountId} />
            </div>
          ))}
      </div>
    </div>
  )
}
