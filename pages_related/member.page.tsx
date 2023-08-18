// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { useRouter } from 'next/router'
import { MemberProvider, useMembers, useSkills } from '@/entities'
import { Loader, PageTabs } from '@/ui'
import { useCanSee } from '@/hooks'
import { useEffect } from 'react'
import { MemberDetails, SkillList, SkillMemberStats } from '@/components'
import { SKILL_CATEGORIES } from '@/utils'

export function Member() {
  // Stores --------------------------------------------------
  const { data: session } = useSession()
  const { loading, fetchMember, getMember } = useMembers()
  const { setMembers } = useSkills()
  // Hooks --------------------------------------------------
  const { query } = useRouter()
  const { justCoach } = useCanSee()

  // Constantes --------------------------------------------------
  const user = session?.user
  const member = getMember(query.id as string)
  const tabs = [
    {
      title: 'Détails',
      tab: 'details',
      element: (
        <div className="flex flex-col gap-3 p-2">
          <MemberDetails />
        </div>
      ),
    },
    {
      title: 'stats',
      tab: 'stats',
      element: (
        <div>
          <div className="sticky top-0 bg-arrd-bg p-1 text-center text-arrd-highlight">{member?.username}</div>
          <SkillMemberStats />
        </div>
      ),
    },
    {
      title: 'derby',
      tab: 'derby',
      element: (
        <div>
          <div className="sticky top-0 bg-arrd-bg p-1 text-center text-arrd-highlight">{member?.username}</div>
          <SkillList category={SKILL_CATEGORIES.derby} editable />
        </div>
      ),
    },
    {
      title: 'patin',
      tab: 'patin',
      element: (
        <div>
          <div className="sticky top-0 bg-arrd-bg p-1 text-center text-arrd-highlight">{member?.username}</div>
          <SkillList category={SKILL_CATEGORIES.patinage} editable />
        </div>
      ),
    },
  ]

  // Effets --------------------------------------------------

  useEffect(() => {
    if (!member) fetchMember(query.id as string)
  }, [query.id])

  useEffect(() => {
    if (member) setMembers([member as any])
  }, [member])

  // Rendus --------------------------------------------------

  if (!user) return <></>

  if (loading)
    return (
      <AuthLayout title="Ma progression">
        <div className="flex h-full w-full items-center justify-center p-3">
          <Loader />
        </div>
      </AuthLayout>
    )

  if (!loading && !member)
    return (
      <AuthLayout title="Ma progression">
        <div className="flex h-full w-full items-center justify-center p-3">
          <p>Mais ! personne ne sait qui {"c'est !"}</p>
        </div>
      </AuthLayout>
    )

  return (
    <AuthLayout title={member.username}>
      <MemberProvider member={member}>
        {justCoach ? (
          <div className="grid h-full grid-rows-[auto_1fr_auto] items-start gap-1 p-2">
            <PageTabs tabs={tabs} />
          </div>
        ) : (
          <MemberDetails />
        )}
      </MemberProvider>
    </AuthLayout>
  )
}
