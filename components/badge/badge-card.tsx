import type { IBadge } from '@/entities'
import { BadgeIcon } from '@/ui'
import { ReadEditor } from '../editor'
import dayjs from 'dayjs'

type BadgeProps = {
  badge: IBadge
}
export function BadgeCard({ badge }: BadgeProps) {
  return (
    <div
      data-win={badge.win}
      className="grid cursor-pointer grid-cols-[auto_1fr] items-center  gap-3 rounded-md border-2 border-arrd-bgLight p-2 transition-colors hover:border-arrd-primary hover:opacity-100 data-[win=false]:border-dashed data-[win=false]:opacity-50 data-[win=false]:hover:opacity-100"
    >
      <div>
        <BadgeIcon
          className="h-10 w-10 data-[color='argent']:fill-zinc-400 data-[color='or']:fill-amber-400 data-[color=bronze]:fill-orange-800"
          data-color={badge.level}
        />
      </div>
      <div>
        <div
          className="text-lg  text-arrd-textExtraLight first-letter:uppercase data-[color='argent']:text-zinc-400 data-[color='or']:text-amber-400 data-[color=bronze]:text-orange-800"
          data-color={badge.level}
        >
          {badge.name}
        </div>
        <div className="text-xs text-arrd-textExtraLight">
          <ReadEditor content={badge.description} />
        </div>

        {badge.win ? (
          <div className="text-end text-xs text-arrd-highlight">obtenu</div>
        ) : (
          <div className="text-end text-xs text-arrd-textError">verrouillé</div>
        )}
      </div>
    </div>
  )
}
