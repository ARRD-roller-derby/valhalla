// Bibliothèque externe
import { useEffect, useState } from 'react'

// Bibliothèque interne
import { type IBadge, useBadges } from '@/entities'
import { ListSelector, Loader, TextInput } from '@/ui'
import { BadgeCard } from './badge-card'
import { IBadgeSchema } from '@/models'

const LEVELS = [
  {
    label: 'Tous',
    value: 'tous',
  },
  {
    label: 'Bronze',
    value: 'bronze',
  },
  {
    label: 'Argent',
    value: 'argent',
  },
  {
    label: 'Or',
    value: 'or',
  },
]
type BadgesListProps = {
  userId?: string
}

export function BadgesList({ userId }: BadgesListProps) {
  // Store -----------------------------------
  const { loadingGet, badges, getBadges } = useBadges()
  const [search, setSearch] = useState<string>('')
  const [level, setLevel] = useState<{ label: string; value: unknown }>(LEVELS[0])

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
    <div className="flex= mx-auto max-w-lg flex-col gap-4">
      <div className="my-1 flex flex-col justify-center gap-2 sm:grid sm:grid-cols-[3fr_1fr] sm:items-center">
        <TextInput value={search} setValue={setSearch} />
        <div className="w-full pb-1">
          <ListSelector options={LEVELS} onSelect={setLevel} defaultValue={LEVELS[0]} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {badges
          .filter((badge) => {
            if (level.value === 'tous') return true
            return badge.level === level.value
          })
          .filter((badge) => badge.name.toLowerCase().includes(search.toLowerCase()))
          .sort(sortedBadges)
          .map((badge) => (
            <BadgeCard key={badge._id.toString()} badge={badge} />
          ))}
      </div>
    </div>
  )
}
