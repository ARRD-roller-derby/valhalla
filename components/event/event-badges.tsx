// Bibliothèques externes
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { Checkbox, ListSelector, Loader, TextInput } from '@/ui'
import { useBadges, useEvent } from '@/entities'
import { BadgeEvent } from '../badge/badge-event'
import { BADGE_LEVELS } from '@/utils/badge-levels'
import { LEVELS } from '@/utils'

export function EventBadges() {
  const { data: session } = useSession()
  const { getBadgesByEvent, badges, loadingGet } = useBadges()
  const [search, setSearch] = useState<string>('')
  const [displayOnlyNotWin, setDisplayOnlyNotWin] = useState<boolean>(false)
  const [level, setLevel] = useState<{ label: string; value: unknown }>(LEVELS[0])

  const { event } = useEvent()

  useEffect(() => {
    if (session?.user) getBadgesByEvent(event._id.toString())
  }, [session])

  return (
    <div className="mx-auto flex w-full flex-col gap-4 lg:w-auto lg:max-w-lg">
      <div className="my-1 flex w-full flex-col justify-center gap-2 sm:grid sm:grid-cols-[2fr_1fr] sm:items-center">
        <TextInput value={search} setValue={setSearch} />
        <div className="w-full pb-1">
          <ListSelector options={BADGE_LEVELS} onSelect={setLevel} defaultValue={LEVELS[0]} />
        </div>
      </div>
      <div className="flex justify-center">
        <Checkbox
          label="Uniquement les badges non obtenus"
          onChange={() => setDisplayOnlyNotWin(!displayOnlyNotWin)}
          checked={displayOnlyNotWin}
        />
      </div>
      <div className="mx-auto mt-2 flex  max-w-[300px] flex-col justify-center gap-3 p-3">
        {loadingGet ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {badges
              .filter((badge) => {
                if (level.value === 'tous') return true
                return badge.level === level.value
              })
              .filter((badge) => badge.name.toLowerCase().includes(search.toLowerCase()))
              .map((badge) => (
                <BadgeEvent key={badge._id} badge={badge as any} displayOnlyNotWin={displayOnlyNotWin} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
