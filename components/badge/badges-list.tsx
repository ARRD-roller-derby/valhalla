// Bibliothèque externe
import { useEffect } from 'react'

// Bibliothèque interne
import { type IBadge, useBadges } from '@/entities'
import { Loader } from '@/ui'
import { BadgeCard } from './badge-card'

type BadgesListProps = {
  userId?: string
}

export function BadgesList({ userId }: BadgesListProps) {
  // Store -----------------------------------
  const { loadingGet, badges, getBadges } = useBadges()

  // Const -----------------------------------
  const sortedBadges = (a: IBadge, b: IBadge) => {
    const getBadgeScore = (badge: IBadge): number => {
      let score = 0

      score += badge.win ? 1000 : 0
      switch (badge.level) {
        case 'or':
          score += 100
          break
        case 'argent':
          score += 50
          break
        case 'bronze':
          score += 25
          break
      }

      return score
    }

    const scoreA = getBadgeScore(a)
    const scoreB = getBadgeScore(b)

    if (scoreA !== scoreB) return scoreB - scoreA

    return a.name.localeCompare(b.name)
  }

  // Effects -----------------------------------
  useEffect(() => {
    getBadges(userId)
  }, [])

  if (loadingGet)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    )

  if (!loadingGet && badges.length === 0)
    return <div className="flex h-full items-center justify-center">Aucun badge trouvé</div>

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      {badges.sort(sortedBadges).map((badge) => (
        <BadgeCard key={badge._id.toString()} badge={badge} />
      ))}
    </div>
  )
}
