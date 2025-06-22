// Bibliothèques externes
import { useEffect } from 'react'

// Bibliothèques internes
import { EventProvider, TriggerTypes, useEvents, useSocketTrigger, useWeather } from '@/entities'
import { Loader } from '@/ui/Loader'
import { EventCard } from '@/components'
import { useSession } from 'next-auth/react'

// Modèles
import { IEvent } from '@/models'

export function NextEvents() {
  // Stores -------------------------------------------------------------------
  const { data: session } = useSession()
  const { events, loading, eventFilter, fetchForNext, socketEvt } = useEvents()

  // Hooks --------------------------------------------------------------------
  const { getForecasts } = useWeather()
  useSocketTrigger<{ event: IEvent }>(TriggerTypes.EVENT, socketEvt)

  // Effets ------------------------------------------------------------------
  useEffect(() => {
    if (session?.user) {
      fetchForNext()
      //getForecasts()
    }
  }, [])

  // Rendu --------------------------------------------------------------------
  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    )

  return (
    <div className="flex flex-col gap-4 md:grid lg:grid-cols-2 xl:grid-cols-3">
      {events.filter(eventFilter).map((event) => (
        <EventProvider event={event} key={event._id.toString()}>
          <EventCard />
        </EventProvider>
      ))}
    </div>
  )
}
