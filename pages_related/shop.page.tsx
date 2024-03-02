// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { boosters } from '@/utils/boosters'
import { Booster } from '@/components/card/booster'

export function Shop() {
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return null

  return (
    <AuthLayout title="Shop">
      <div className="flex flex-col gap-4 p-3 sm:grid sm:grid-cols-3 lg:grid-cols-4">
        {boosters.map((booster) => (
          <Booster key={booster.key} booster={booster} />
        ))}
      </div>
    </AuthLayout>
  )
}
