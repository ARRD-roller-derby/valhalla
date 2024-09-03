// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { useRouter } from 'next/router'
import { MemberProvider, useMembers } from '@/entities'
import { Loader, PageTabs } from '@/ui'
import { useCanSee } from '@/hooks'
import { useEffect } from 'react'
import { BadgesList, MemberDetails } from '@/components'

export function Member() {
  // Stores --------------------------------------------------
  const { data: session } = useSession()
  const { loading, fetchMember, getMember } = useMembers()
  // Hooks --------------------------------------------------
  const { query } = useRouter()

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
      title: 'Badges',
      tab: 'badges',
      element: <BadgesList userId={member?.id} />,
    },
  ]

  // Effets --------------------------------------------------

  useEffect(() => {
    if (!member) fetchMember(query.id as string)
  }, [query.id])

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
        <div className="grid h-full grid-rows-[auto_auto_1fr_auto] items-start gap-1 p-2">
          <header className="flex items-center justify-center gap-2">
            {member.avatar && <img src={member.avatar} className="h-12 w-12 rounded-full" />}
            <div className="text-center text-2xl font-bold text-arrd-highlight">{member?.username}</div>
          </header>
          <PageTabs tabs={tabs} />
        </div>
      </MemberProvider>
    </AuthLayout>
  )
}
