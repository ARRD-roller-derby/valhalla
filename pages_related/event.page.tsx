import { EventFetch } from '@/components'
import { useEvents } from '@/entities'
import { AuthLayout } from '@/layout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export function Event() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return <></>

  const { getEvent } = useEvents()

  const event = getEvent(router.query.eventId as any)
  const title = event && event.title ? `${event.title} | AGENDA` : `AGENDA`

  return (
    <AuthLayout title={title}>
      <EventFetch />
    </AuthLayout>
  )
}
