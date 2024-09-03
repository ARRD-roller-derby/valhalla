import { useBadges } from '@/entities'
import { Loader } from '@/ui'
import { Podium } from '@/ui/podium'
import { useEffect } from 'react'

export function BadgeHallOfFame() {
  const { hallOfFame, getLoading, getHallOfFame } = useBadges()

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
    <div className="relative mt-6 flex h-full flex-col items-center gap-6 ">
      {hallOfFame?.map((winner: any, index) => <Podium key={index} podium={winner} />)}
    </div>
  )
}
