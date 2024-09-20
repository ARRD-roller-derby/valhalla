// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'

import { RulesList } from '@/components/rules/RulesList'

export function Rules() {
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return null

  return (
    <AuthLayout title="Badges">
      <div className="grid h-full grid-rows-[auto_1fr_auto] items-start gap-1 p-2">
        <RulesList />
      </div>
    </AuthLayout>
  )
}
