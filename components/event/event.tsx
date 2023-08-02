// Bibliothèques internes
import { EventAttendees, EventDetails, EventParticipation } from '@/components'
import { useEvent } from '@/entities'
import { CancelMsg, PageTabs } from '@/ui'
import { dc } from '@/utils'

export function Event() {
  const { event } = useEvent()

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr_auto] items-start gap-1 p-2">
      <div>
        <h1 className={dc('text-center text-3xl', [event.cancelled, 'text-arrd-textError'])}>{event.title}</h1>
      </div>
      <PageTabs
        tabs={[
          {
            title: 'Détails',
            tab: 'details',
            element: <EventDetails />,
          },
          {
            title: 'Participants',
            tab: 'participants',
            element: <EventAttendees />,
          },
        ]}
      />

      {event.cancelled ? (
        <div className="flex justify-end">
          <CancelMsg />
        </div>
      ) : (
        <div className="p-2">
          <EventParticipation />
        </div>
      )}
    </div>
  )
}
