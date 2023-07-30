import { EventAttendees, EventDetails } from '@/components'
import { EventParticipation } from '@/components/event/event-participation'
import { TriggerTypes, useEvent, useEvents, useSocketTrigger } from '@/entities'
import { IEvent } from '@/models'
import { CancelMsg, PageTabs } from '@/ui'
import { dc } from '@/utils'

export function Event() {
  const { setEvent } = useEvents()
  const { event } = useEvent()
  useSocketTrigger<{ event: IEvent }>(TriggerTypes.EVENT, (msg) => {
    if (!msg || !msg.event) return
    const isThisEvent = event?._id === msg.event._id
    if (isThisEvent) setEvent(msg.event)
  })

  return (
    <div className="relative h-full">
      <div className="absolute bottom-0 left-0 right-0 top-0 grid grid-rows-[auto_auto_1fr_auto] items-start gap-1 p-2">
        <div>
          <h1 className={dc('text-center text-3xl', [event.cancelled, 'text-arrd-textError'])}>{event.title}</h1>
        </div>
        <PageTabs
          tabs={[
            {
              title: 'Détails',
              tab: 'details',
              element: (
                <div className="flex flex-col gap-3 p-2">
                  <EventDetails />
                </div>
              ),
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
          <EventParticipation />
        )}
      </div>
    </div>
  )
}
