import { IBadge } from '@/entities'
import { BADGE_LEVELS } from './badge-levels'

export const sortedBadges = (a: IBadge, b: IBadge) => {
  const getBadgeScore = (badge: IBadge): number => {
    let score = 0

    // score += badge.win ? 1000 : 0

    const levelIndex = BADGE_LEVELS.findIndex((level) => level.value === badge.level)

    if (levelIndex !== -1) score += (levelIndex + 1) * 100

    return score
  }

  const scoreA = getBadgeScore(a)
  const scoreB = getBadgeScore(b)

  if (scoreA !== scoreB) return scoreB - scoreA

  return a.name.localeCompare(b.name)
}
