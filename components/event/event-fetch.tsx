// Bibliothèques externes
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { EventProvider, TriggerTypes, useEvents, useSocketTrigger } from '@/entities'
import { Loader } from '@/ui/Loader'
import { Event } from '@/components'

// Modèles
import { IEvent } from '@/models'

export function EventFetch() {
  // stores
  const { data: sessions } = useSession()
  const { loading, findOne, getEvent, setEvent } = useEvents()

  // hooks
  const router = useRouter()
  useSocketTrigger<{ event: IEvent }>(TriggerTypes.EVENT, (msg) => {
    if (!msg || !msg.event) return
    const isThisEvent = event?._id === msg.event._id
    if (isThisEvent) setEvent(msg.event)
  })

  // const
  const event = getEvent(router.query.eventId as any)

  // effects
  useEffect(() => {
    if (sessions?.user) findOne(router.query.eventId as any)
  }, [sessions])

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
