// Bibliothèques externes
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { MemberProvider, useMembers } from '@/entities'
import { Loader } from '@/ui'
import { MemberCard } from '@/components'

export function MemberList() {
  // Stores -------------------------------------------------------------------
  const { data: session } = useSession()
  const { loading, members, fetchMembers } = useMembers()

  // Effets -------------------------------------------------------------------
  useEffect(() => {
    if (session?.user) fetchMembers()
  }, [session])

  return (
    <>
      {loading && members.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      )}
      {!loading && members.length > 0 && (
        <div className="flex flex-col gap-4 p-3 sm:grid sm:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <MemberProvider member={member}>
              <MemberCard />
            </MemberProvider>
          ))}
        </div>
      )}
      {!loading && members.length === 0 && <div className="flex h-full items-center justify-center">non trouvé</div>}
    </>
  )
}
