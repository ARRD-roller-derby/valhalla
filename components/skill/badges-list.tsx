// Bibliothèque externe
import { useEffect } from 'react'

// Bibliothèque interne
import { type IBadge, useBadges } from '@/entities'
import { Loader } from '@/ui'
import { BadgeCard } from '../badge/badge-card'

export function BadgesList() {
  // Store -----------------------------------
  const { loadingGet, badges, getBadges } = useBadges()

  // Const -----------------------------------
  const sortedBadges = (a: IBadge, b: IBadge) => {
    return a.win ? -1 : a.name.localeCompare(b.name)
  }

  // Effects -----------------------------------
  useEffect(() => {
    getBadges()
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
