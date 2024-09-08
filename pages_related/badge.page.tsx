// Bibliothèques externes
import { useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { BadgeIcon, Loader, PageTabs } from '@/ui'
import { BadgeForm } from '@/components/badge/badge-form'
import { checkRoles, ROLES } from '@/utils'
import { BadgesList, ReadEditor } from '@/components'
import { useBadges } from '@/entities'
import { useRouter } from 'next/router'
import { BadgeDelete } from '@/components/badge/badge-delete'

export function Badge() {
  const { data: session } = useSession()
  const {
    query: { id },
  } = useRouter()

  const { loadingGet, badges, getBadge } = useBadges()

  const badge = useMemo(() => {
    return badges.find((badge) => badge._id === id)
  }, [badges, id])
  const user = session?.user
  if (!user) return null

  // const
  const canSee = useMemo(() => {
    if (!session?.user) return false
    return checkRoles([ROLES.coach, ROLES.dev], session.user)
  }, [session])

  useEffect(() => {
    getBadge(id as string)
  }, [])

  if (loadingGet)
    return (
      <AuthLayout title="Badges">
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      </AuthLayout>
    )
  if (!badge)
    return (
      <AuthLayout title="Badges">
        <div className="flex h-full items-center justify-center">
          <div>Badge non trouvé</div>
        </div>
      </AuthLayout>
    )
  return (
    <AuthLayout title="Badges">
      <div className="grid h-full grid-rows-[auto_1fr_auto]  gap-1 p-2">
        {loadingGet && <Loader />}
        {canSee ? (
          <PageTabs
            tabs={[
              {
                title: 'Badges',
                tab: 'badge',
                element: (
                  <div className="mx-auto grid max-w-xl cursor-pointer grid-cols-[auto_1fr] items-center gap-3 p-2 ">
                    <div>
                      <BadgeIcon
                        className="h-10 w-10 data-[color='argent']:fill-zinc-400 data-[color='or']:fill-amber-400 data-[color=bronze]:fill-orange-800"
                        data-color={badge.level}
                      />
                    </div>
                    <div>
                      <div
                        className="text-lg  text-arrd-textExtraLight first-letter:uppercase data-[color='argent']:text-zinc-400 data-[color='or']:text-amber-400 data-[color=bronze]:text-orange-800"
                        data-color={badge.level}
                      >
                        {badge.name}
                      </div>
                      <div className="text-xs text-arrd-textExtraLight hover:text-arrd-textExtraLight">
                        <ReadEditor content={badge.description} />
                      </div>
                      <div className="mt-6 flex justify-end">
                        <BadgeDelete badge={badge} />
                      </div>
                    </div>
                  </div>
                ),
              },

              {
                title: 'Modifier',
                tab: 'update',
                element: <BadgeForm formInit={badge} returnTab="badge" />,
              },
            ]}
          />
        ) : (
          <div className="flex flex-col gap-3 p-2">
            <div className="mx-auto grid max-w-xl cursor-pointer grid-cols-[auto_1fr] items-center gap-3 p-2 ">
              <div>
                <BadgeIcon
                  className="h-10 w-10 data-[color='argent']:fill-zinc-400 data-[color='or']:fill-amber-400 data-[color=bronze]:fill-orange-800"
                  data-color={badge.level}
                />
              </div>
              <div>
                <div
                  className="text-lg  text-arrd-textExtraLight first-letter:uppercase data-[color='argent']:text-zinc-400 data-[color='or']:text-amber-400 data-[color=bronze]:text-orange-800"
                  data-color={badge.level}
                >
                  {badge.name}
                </div>
                <div className="text-xs text-arrd-textExtraLight hover:text-arrd-textExtraLight">
                  <ReadEditor content={badge.description} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
