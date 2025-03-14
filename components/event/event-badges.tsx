// Bibliothèques externes
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { Loader } from '@/ui'
import { useBadges, useEvent } from '@/entities'
import { BadgeEvent } from '../badge/badge-event'

export function EventBadges() {
  const { data: session } = useSession()
  const { getBadgesByEvent, badges, loadingGet } = useBadges()

  const { event } = useEvent()

  useEffect(() => {
    if (session?.user) getBadgesByEvent(event._id.toString())
  }, [session])

  return (
    <div className="mx-auto mt-2 flex  max-w-[300px] flex-col justify-center gap-3 p-3">
      {loadingGet ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div>search</div>
          {badges.map((badge) => (
            <BadgeEvent key={badge._id} badge={badge as any} />
          ))}
        </div>
      )}
    </div>
  )
}
