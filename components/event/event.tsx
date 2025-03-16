// Bibliothèques internes
import { EventAttendees, EventDetails, EventParticipation } from '@/components'
import { useEvent } from '@/entities'
import { CancelMsg, PageTabs } from '@/ui'
import { dc } from '@/utils'
import { EventBadges } from './event-badges'
import { EventStat } from './event-stats'

export function Event() {
  // Stores -------------------------------------------------------------------
  const { event } = useEvent()
  const tabs = [
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
    {
      title: 'Stats',
      tab: 'stats',
      element: <EventStat />,
    },
    {
      title: 'Badges',
      tab: 'badges',
      element: <EventBadges />,
    },
  ]

  // Rendu --------------------------------------------------------------------
  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr_auto] items-start gap-1 p-2">
      <div>
        <h1 className={dc('text-center text-3xl', [event.cancelled, 'text-arrd-textError'])}>{event.title}</h1>
      </div>
      <PageTabs tabs={tabs.filter((tab) => (tab.tab === 'badges' ? event.type.match(/patinage|derby/i) : true))} />

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
