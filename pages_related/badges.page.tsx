// Bibliothèques externes
import { useMemo } from 'react'
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { PageTabs } from '@/ui'
import { BadgeForm } from '@/components/badge/badge-form'
import { checkRoles, ROLES } from '@/utils'
import { BadgesList } from '@/components'
import { BadgeHallOfFame } from '@/components/badge/badge-hall-of-fame'
import { BadgesClassement } from '@/components/badge/badges-classement'

export function Badges() {
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return null

  // const
  const canSee = useMemo(() => {
    if (!session?.user) return false
    return checkRoles([ROLES.coach, ROLES.dev], session.user)
  }, [session])

  const tabs = [
    {
      title: 'Badges',
      tab: 'badges',
      element: (
        <div className="flex flex-col gap-3 p-2">
          <BadgesList />
        </div>
      ),
    },
    {
      title: 'Hall of Fame',
      tab: 'hall_of_fame',
      element: <BadgeHallOfFame />,
    },
    {
      title: 'Classement',
      tab: 'classement',
      element: <BadgesClassement />,
    },
  ]

  const otherTabs = [
    {
      title: 'Ajouter un badge',
      tab: 'add_badge',
      element: <BadgeForm />,
    },
  ]

  const allTabs = canSee ? [...tabs, ...otherTabs] : tabs

  return (
    <AuthLayout title="Badges">
      <div className="grid h-full grid-rows-[auto_1fr_auto] items-start gap-1 p-2">
        <PageTabs tabs={allTabs} />
      </div>
    </AuthLayout>
  )
}
