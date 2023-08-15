// Bibliothèques internes
import { EventProvider, useEvents } from '@/entities'
import { EventLink } from '@/components'

export function CalEventForDay() {
  // Stores ------------------------------------------------------------------
  const { getEventForCurrentDay } = useEvents()

  // Constantes --------------------------------------------------------------
  const events = getEventForCurrentDay()

  // Rendu -------------------------------------------------------------------
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
