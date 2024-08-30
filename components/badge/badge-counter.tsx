import { TriggerTypes, useSocketTrigger } from '@/entities'
import { BadgeIcon } from '@/ui'
import Link from 'next/link'
import { useState } from 'react'

export function BadgeCounter() {
  const [count, setCount] = useState(0)
  // stores

  useSocketTrigger<number>(TriggerTypes.BADGE_COUNT, (msg) => {
    if (typeof msg !== 'number') return
    setCount(msg as number)
  })

  //TODO faire l'appel aux badges de l'utilisateur
  return (
    <Link href={'/badges'} className="relative cursor-pointer pt-1">
      <BadgeIcon className="h-7 w-7 fill-arrd-primary" />
      <div className="absolute -left-[2px] bottom-[1px] flex h-4 w-4 translate-x-1/2 items-center justify-center rounded-full bg-arrd-primary text-xs  text-arrd-textExtraLight">
        {count}
      </div>
    </Link>
  )
}
