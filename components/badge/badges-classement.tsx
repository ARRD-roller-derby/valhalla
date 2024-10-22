import { useBadges } from '@/entities'
import { BadgeIcon, CardUI, Loader } from '@/ui'
import { useEffect } from 'react'

export function BadgesClassement() {
  const { classement, getLoading, getHallOfFame } = useBadges()

  useEffect(() => {
    getHallOfFame()
  }, [])

  if (getLoading())
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    )

  return (
    <div className="relative mx-auto mt-6 flex h-full max-w-lg flex-col gap-3">
      {classement.map((user) => (
        <CardUI>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                <div className="text-arrd-highlight">{user.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <BadgeIcon className="w-4 fill-arrd-primary" />
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-arrd-secondary font-bold text-arrd-textLight">
                  {user.badges.total}
                </div>
              </div>
            </div>
            {/*<div className="flex justify-center gap-2">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-sm text-black data-[count='0']:opacity-50"
                data-count={user.badges.or}
              >
                {user.badges.or}
              </div>
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full  bg-zinc-400 text-sm text-black data-[count='0']:opacity-50"
                data-count={user.badges.argent}
              >
                {user.badges.argent}
              </div>
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full  bg-orange-800 text-sm text-black data-[count='0']:opacity-50"
                data-count={user.badges.bronze}
              >
                {user.badges.bronze}
              </div>
            </div> */}
          </div>
        </CardUI>
      ))}
    </div>
  )
}
