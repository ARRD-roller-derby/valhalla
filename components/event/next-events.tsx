// Bibliothèques externes
import { useEffect } from 'react'

// Bibliothèques internes
import { EventProvider, TriggerTypes, useEvents, useSocketTrigger } from '@/entities'
import { Loader } from '@/ui/Loader'
import { EventCard } from '@/components'
import { useSession } from 'next-auth/react'

// Modèles
import { IEvent } from '@/models'

export function NextEvents() {
  // stores
  const { data: session } = useSession()
  const { events, loading, fetchForNext, socketEvt } = useEvents()

  // hooks
  useSocketTrigger<{ event: IEvent }>(TriggerTypes.EVENT, socketEvt)

  // effects
  useEffect(() => {
    if (session?.user) fetchForNext()
  }, [session])

  // render
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
