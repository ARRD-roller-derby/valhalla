// Bibliothèque externe
import { useEffect, useMemo, useState } from 'react'

// Bibliothèque interne
import { type IBadge, useBadges } from '@/entities'
import { ListSelector, Loader, TextInput } from '@/ui'
import { BadgeCard } from './badge-card'

type BadgesListProps = {
  userId?: string
}

export function BadgesList({ userId }: BadgesListProps) {
  // Store -----------------------------------
  const { loadingGet, badges, getBadges } = useBadges()
  const [search, setSearch] = useState<string>('')
  const [level, setLevel] = useState<{ label: string; value: unknown }>({
    label: 'Tous',
    value: 'tous',
  })
  const [type, setType] = useState<{ label: string; value: unknown }>({
    label: 'Tous',
    value: 'tous',
  })

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

  const types = useMemo(() => {
    const types = new Set<string>()
    types.add('tous')
    badges.forEach((badge) => types.add(badge.type))
    return Array.from(types).map((type) => ({ label: type, value: type }))
  }, [badges])

  const levels = useMemo(() => {
    const levels = new Set<string>()
    levels.add('tous')
    badges.forEach((badge) => levels.add(badge.level))
    return Array.from(levels).map((level) => ({ label: level, value: level }))
  }, [badges])

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
      <div className="my-1 flex flex-col justify-center gap-2 sm:grid sm:grid-cols-[3fr_1fr_1fr] sm:items-center">
        <TextInput value={search} setValue={setSearch} />
        <div className="w-full pb-1">
          {types?.length && <ListSelector options={types} onSelect={setType} defaultValue={types[0]} />}
        </div>
        <div className="w-full pb-1">
          {levels.length && <ListSelector options={levels} onSelect={setLevel} defaultValue={levels[0]} />}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {badges
          .filter((badge) => {
            if (level.value === 'tous') return true
            return badge.level === level.value
          })
          .filter((badge) => {
            if (type.value === 'tous') return true
            return badge.type === type.value
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
