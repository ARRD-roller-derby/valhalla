import { useEffect, useState } from 'react'
import Link from 'next/link'

import { TriggerTypes, useBadges, useSocketTrigger } from '@/entities'
import { BadgeIcon } from '@/ui'

export function BadgeCounter() {
  const { getCount } = useBadges()
  const [count, setCount] = useState(0)

  useSocketTrigger<number>(TriggerTypes.BADGE_COUNT, (msg: any) => {
    if (!msg || typeof msg?.count !== 'number') return
    setCount(msg.count as number)
  })

  const handleFetch = async () => {
    setCount((await getCount()) as number)
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return (
    <Link href={'/badges'} className="relative cursor-pointer pt-1">
      <BadgeIcon className="h-7 w-7 fill-arrd-primary" />
      <div className="absolute -left-[2px] bottom-[1px] flex h-4 w-4 translate-x-1/2 items-center justify-center rounded-full bg-arrd-primary text-xs  text-arrd-textExtraLight">
        {count}
      </div>
    </Link>
  )
}
