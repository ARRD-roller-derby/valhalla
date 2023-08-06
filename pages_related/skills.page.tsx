// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { PageTabs } from '@/ui'
import { useMemo } from 'react'
import { ROLES, checkRoles } from '@/utils'
import { SkillFormModal } from '@/components'

export function Skills() {
  // Stores
  const { data: session } = useSession()
  const user = session?.user

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
              title: 'Derby',
              tab: 'derby',
              element: (
                <div className="flex flex-col gap-3 p-2">
                  {canSee && (
                    <div className="flex justify-end">
                      <SkillFormModal />
                    </div>
                  )}

                  <div>Contenu derby</div>
                </div>
              ),
            },
            {
              title: 'Patinage',
              tab: 'patin',
              element: (
                <div className="flex flex-col gap-3 p-2">
                  {canSee && (
                    <div className="flex justify-end">
                      <SkillFormModal />
                    </div>
                  )}

                  <div>Contenu Patinage</div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </AuthLayout>
  )
}
