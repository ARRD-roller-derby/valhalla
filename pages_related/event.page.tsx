// Bibliothèques externes
import { useRouter } from 'next/router'

// Bibliothèques internes
import { EventFetch } from '@/components'
import { useEvents } from '@/entities'
import { AuthLayout } from '@/layout'

export function Event() {
  // stores
  const { getEvent } = useEvents()

  // hooks
  const router = useRouter()

  // const
  const event = getEvent(router.query.eventId as any)
  const title = event && event.title ? `${event.title} | AGENDA` : `AGENDA`

  return (
    <AuthLayout title={title}>
      <EventFetch />
    </AuthLayout>
  )
}
