// Bibliothèque externe
import { useEffect, useState } from 'react'

// Bibliothèque interne
import { useBadges } from '@/entities'
import { Checkbox, ListSelector, Loader, TextInput } from '@/ui'
import { BadgeCard } from './badge-card'
import { BADGE_LEVELS } from '@/utils/badge-levels'
import { sortedBadges } from '@/utils/sort-badges'
import { LEVELS } from '@/utils'

type BadgesListProps = {
  userId?: string
}

export function BadgesList({ userId }: BadgesListProps) {
  // Store -----------------------------------
  const { loadingGet, badges, getBadges } = useBadges()
  const [search, setSearch] = useState<string>('')
  const [displayOnlyWin, setDisplayOnlyWin] = useState<boolean>(false)
  const [level, setLevel] = useState<{ label: string; value: unknown }>(LEVELS[0])

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
    <div className="mx-auto flex w-full flex-col gap-4 lg:w-auto lg:max-w-lg">
      <div className="my-1 flex w-full flex-col justify-center gap-2 sm:grid sm:grid-cols-[2fr_1fr] sm:items-center">
        <TextInput value={search} setValue={setSearch} placeholder="Rechercher un badge" />
        <div className="w-full pb-1">
          <ListSelector options={[LEVELS[0], ...BADGE_LEVELS]} onSelect={setLevel} defaultValue={LEVELS[0]} />
        </div>
      </div>
      <div className="flex justify-center">
        <Checkbox
          label="Uniquement les badges obtenus"
          onChange={() => setDisplayOnlyWin(!displayOnlyWin)}
          checked={displayOnlyWin}
        />
      </div>
      <div className="flex flex-col gap-2">
        {badges
          .filter((badge) => (displayOnlyWin ? badge.win : true))
          .filter((badge) => {
            if (level.value === 'tous') return true
            return badge.level === level.value
          })
          .filter((badge) => badge.name.toLowerCase().includes(search.toLowerCase()))
          .sort(sortedBadges)
          .map((badge) => (
            <BadgeCard key={`${badge._id}`} badge={badge} />
          ))}
      </div>
    </div>
  )
}
