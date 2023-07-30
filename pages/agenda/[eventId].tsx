import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { EventProvider, useEvents } from '@/entities'
import { useEffect, useState } from 'react'
import { AuthLayout } from '@/layout'
import { Loader } from '@/ui/Loader'

const Event = dynamic(() => import('@/pages_related').then((comp) => comp.Event), { ssr: false })
export default function EventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { findOne, getEvent } = useEvents()
  const event = getEvent(router.query.eventId as any)
  const title = event ? `${event.title} | AGENDA` : `AGENDA`

  const handleFetch = async () => {
    setLoading(true)
    await findOne(router.query.eventId as any)
    setLoading(false)
  }
  useEffect(() => {
    if (!event && !loading) handleFetch()
  }, [])

  return (
    <AuthLayout title={title}>
      {loading && !event && (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      )}
      {!loading && event && (
        <EventProvider event={event}>
          <Event />
        </EventProvider>
      )}
      {!loading && !event && <div className="flex h-full items-center justify-center">non trouvé</div>}
    </AuthLayout>
  )
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })
  return !session
    ? {
        redirect: { destination: '/login' },
      }
    : { props: { session } }
}
