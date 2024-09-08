import type { IBadge } from '@/entities'
import { BadgeIcon } from '@/ui'
import { ReadEditor } from '../editor'
import { BadgeCardStatus } from './badge-card-status'
import Link from 'next/link'

type BadgeProps = {
  badge: IBadge
}
export function BadgeCard({ badge }: BadgeProps) {
  return (
    <div
      data-win={badge.win}
      data-color={badge.level}
      className="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-md border-2 p-2  transition-colors hover:border-arrd-primary hover:opacity-100 data-[win=false]:border-dashed data-[color=argent]:border-zinc-400  data-[color=bronze]:border-orange-800 data-[color=or]:border-amber-400  data-[color]:data-[win=false]:border-arrd-bgLight data-[win=false]:opacity-50 data-[win=false]:hover:opacity-100"
    >
      <Link href={`/badges/${badge._id}`}>
        <BadgeIcon
          className="h-10 w-10 data-[color='argent']:fill-zinc-400 data-[color='or']:fill-amber-400 data-[color=bronze]:fill-orange-800"
          data-color={badge.level}
        />
      </Link>
      <div>
        <Link
          href={`/badges/${badge._id}`}
          className="text-lg  text-arrd-textExtraLight first-letter:uppercase data-[color='argent']:text-zinc-400 data-[color='or']:text-amber-400 data-[color=bronze]:text-orange-800"
          data-color={badge.level}
        >
          {badge.name}
        </Link>
        <Link href={`/badges/${badge._id}`} className="text-xs text-arrd-textExtraLight hover:text-arrd-textExtraLight">
          <ReadEditor content={badge.description} />
        </Link>
        <BadgeCardStatus badge={badge} />
      </div>
    </div>
  )
}
