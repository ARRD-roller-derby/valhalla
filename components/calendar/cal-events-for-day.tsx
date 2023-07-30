import { EventProvider, useEvents } from '@/entities'
import Link from 'next/link'
import { EventLink } from '../event/event-link'

export function CalEventForDay() {
  const { getEventForCurrentDay } = useEvents()
  const events = getEventForCurrentDay()

  if (!events) return null
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
