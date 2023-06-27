import { AuthLayout } from '@/layout'
import { useSession } from 'next-auth/react'

export function Games() {
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return null

  return (
    <AuthLayout title="Agenda">
      <p>Bientôt disponible !</p>
    </AuthLayout>
  )
}
