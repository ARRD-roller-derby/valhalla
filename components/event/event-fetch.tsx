// Bibliothèques externes
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { EventProvider, TriggerTypes, useEvents, useSocketTrigger, useWeather } from '@/entities'
import { Loader } from '@/ui/Loader'
import { Event } from '@/components'

// Modèles
import { IEvent } from '@/models'

export function EventFetch() {
  // stores
  const { data: session } = useSession()
  const { loading, events, findOne, setEvent, getEvent } = useEvents()
  const { getForecasts } = useWeather()
  // hooks
  const router = useRouter()
  useSocketTrigger<{ event: IEvent; userId: string }>(TriggerTypes.EVENT, (msg) => {
    if (!msg || !msg.event) return
    const isThisEvent = router.query.eventId === msg.event._id.toString()
    if (isThisEvent && msg.userId !== session?.user._id) setEvent(msg.event)
  })

  const event = useMemo(() => getEvent(router.query.eventId as any), [session, router.query.eventId, events])

  // effects
  useEffect(() => {
    if (session?.user) {
      getForecasts()
      findOne(router.query.eventId as any)
    }
  }, [session])

  return (
    <>
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
    </>
  )
}
