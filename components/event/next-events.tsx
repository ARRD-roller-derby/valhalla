import { EventProvider, TriggerTypes, useEvents, useSocketTrigger } from '@/entities'
import { Loader } from '@/ui/Loader'
import { useEffect } from 'react'
import { EventCard } from '@/components'
import { IEvent } from '@/models'
import { useSession } from 'next-auth/react'

export function NextEvents() {
  const { data: session } = useSession()
  const { events, loading, fetchForNext, socketEvt } = useEvents()

  useSocketTrigger<{ event: IEvent }>(TriggerTypes.EVENT, socketEvt)

  useEffect(() => {
    if (session?.user) fetchForNext()
  }, [session])

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    )

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventProvider event={event} key={event._id.toString()}>
          <EventCard />
        </EventProvider>
      ))}
    </div>
  )
}
