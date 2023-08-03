// Bibliothèques externes
import { useEffect } from 'react'

// Bibliothèques internes
import { MemberProvider, useMembers } from '@/entities'
import { Loader } from '@/ui'
import { MemberCard } from '@/components'

export function MemberList() {
  const { loading, members, getMembers } = useMembers()

  useEffect(() => {
    getMembers()
  }, [])

  return (
    <>
      {loading && !members && (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      )}
      {!loading && members && (
        <div className="flex flex-col gap-4 p-3 sm:grid sm:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <MemberProvider member={member}>
              <MemberCard />
            </MemberProvider>
          ))}
        </div>
      )}
      {!loading && !members && <div className="flex h-full items-center justify-center">non trouvé</div>}
    </>
  )
}
