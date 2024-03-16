// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { PageTabs } from '@/ui'
import { CardList } from '@/components'

export function Deck() {
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return null

  return (
    <AuthLayout title="Deck">
      <div className="grid h-full grid-rows-[auto_1fr_auto] items-start gap-1 p-2">
        <PageTabs
          tabs={[
            {
              title: 'cartothèque',
              tab: 'cards',
              element: <CardList />,
            },
            {
              title: 'Révision',
              tab: 'revision',
              element: <div>Bientôt disponible</div>,
            },
            {
              title: 'Deck',
              tab: 'deck',
              element: <div>Bientôt disponible</div>,
            },
          ]}
        />
      </div>
    </AuthLayout>
  )
}
