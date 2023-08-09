// Bibliothèques externes
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { PageTabs } from '@/ui'
import { ROLES, SKILL_CATEGORIES, checkRoles } from '@/utils'
import { SkillFormModal, SkillList, SkillMemberStats } from '@/components'
export function Skills() {
  // Stores
  const { data: session } = useSession()

  // const
  const canSee = useMemo(() => {
    if (!session?.user) return false
    return checkRoles([ROLES.coach], session.user)
  }, [session])

  return (
    <AuthLayout title="Ma progression">
      <div className="grid h-full grid-rows-[auto_1fr_auto] items-start gap-1 p-2">
        <PageTabs
          tabs={[
            {
              title: 'Stats',
              tab: 'stats',
              element: (
                <div className="flex flex-col gap-3 p-2">
                  <SkillMemberStats />
                </div>
              ),
            },
            {
              title: 'Derby',
              tab: SKILL_CATEGORIES.derby,
              element: (
                <div className="flex flex-col gap-3 p-2">
                  {canSee && (
                    <div className="flex justify-end">
                      <SkillFormModal />
                    </div>
                  )}

                  <SkillList category={SKILL_CATEGORIES.derby} />
                </div>
              ),
            },
            {
              title: 'Patinage',
              tab: SKILL_CATEGORIES.patinage,
              element: (
                <div className="flex flex-col gap-3 p-2">
                  {canSee && (
                    <div className="flex justify-end">
                      <SkillFormModal />
                    </div>
                  )}

                  <SkillList category={SKILL_CATEGORIES.patinage} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </AuthLayout>
  )
}
