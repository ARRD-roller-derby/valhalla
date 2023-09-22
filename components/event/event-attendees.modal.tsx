import { EventAttendees } from './event-attendees'

export function EventAttendeesModal() {
  return (
    <div className="grid h-[80vh] grid-rows-[1fr] p-3">
      <div className="relative h-full pb-2">
        <div className="absolute bottom-0 left-0 right-0 top-0 overflow-y-auto">
          <EventAttendees />
        </div>
      </div>
    </div>
  )
}
