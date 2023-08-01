// Bibliothèques internes
import { EventProvider, useEvents } from '@/entities'
import { EventLink } from '@/components'

export function CalEventForDay() {
  // stores
  const { getEventForCurrentDay } = useEvents()

  // const
  const events = getEventForCurrentDay()

  if (!events) return <></>

  return (
    <div className="flex  flex-col gap-3 overflow-auto">
      {events.map((event) => (
        <EventProvider key={event._id.toString()} event={event}>
          <EventLink />
        </EventProvider>
      ))}
    </div>
  )
}
