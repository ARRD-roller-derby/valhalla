// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { Grid } from '@/components/run-game/grid'

export function MiniGame() {
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return null

  return (
    <AuthLayout title="mini jeu">
      <div className="flex h-full items-center justify-center gap-1 p-2">
        <Grid />
      </div>
    </AuthLayout>
  )
}
