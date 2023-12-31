// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { MemberList } from '@/components'

export function Repertoire() {
  const { data: session } = useSession()
  const user = session?.user

  if (!user) return <></>
  return (
    <AuthLayout title="Répertoire">
      <MemberList />
    </AuthLayout>
  )
}
