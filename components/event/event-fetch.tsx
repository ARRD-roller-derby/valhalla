import { EventProvider, TriggerTypes, useEvents, useSocketTrigger } from '@/entities'
import { IEvent } from '@/models'
import { Loader } from '@/ui/Loader'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Event } from '@/components'

export function EventFetch() {
  const router = useRouter()
  const { loading, findOne, getEvent, setEvent } = useEvents()
  const event = getEvent(router.query.eventId as any)

  useEffect(() => {
    findOne(router.query.eventId as any)
  }, [])

  useSocketTrigger<{ event: IEvent }>(TriggerTypes.EVENT, (msg) => {
    if (!msg || !msg.event) return
    const isThisEvent = event?._id === msg.event._id
    if (isThisEvent) setEvent(msg.event)
  })

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
