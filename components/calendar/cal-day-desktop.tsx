// Bibliothèques externes
import dayjs from 'dayjs'

// Bibliothèques internes
import { EventFormModal, EventLink } from '@/components'
import { EventProvider, useEvents } from '@/entities'
import { ICallDay, useCanSee } from '@/hooks'
import { dc } from '@/utils'
import { Modal } from '@/ui'

interface CalDayDesktopProps {
  day: ICallDay
}

export function CalDayDesktop({ day }: CalDayDesktopProps) {
  // Stores -----------------------------------------------------------------------------
  const { eventFilter, getEventForDay } = useEvents()

  // Hooks -----------------------------------------------------------------------------
  const { justEventManager } = useCanSee()

  // Constantes -----------------------------------------------------------------------------
  const events = getEventForDay(day.date).filter(eventFilter)
  const noEvent = events.length === 0

  return (
    <div
      className={dc(
        'relative h-24  rounded-md border p-1',
        [day.isCurrentMonth, 'text-arrd-textLight', 'cursor-not-allowed opacity-50'],
        [dayjs().isSame(day.date, 'day'), 'border-arrd-accent', 'border-arrd-border']
      )}
    >
      <EventFormModal
        day={day.date}
        customButton={(onClick) => (
          <div
            className="absolute right-0 top-1 w-full cursor-pointer pr-1 text-right text-xs font-semibold"
            onClick={justEventManager ? onClick : undefined}
          >
            {day.date.format('DD')}
          </div>
        )}
      />

      <div className="flex h-full flex-col pt-6 text-xs">
        {noEvent && justEventManager && (
          <EventFormModal
            day={day.date}
            customButton={(onClick) => (
              <div className="flex-grow cursor-pointer text-arrd-textLight" onClick={onClick} />
            )}
          />
        )}
        {events.length > 0 && (
          <EventProvider event={events[0]}>
            <EventLink small />
          </EventProvider>
        )}
        {events.length > 1 && (
          <Modal
            title={`Événements du ${day.date.format('DD/MM/YYYY')}`}
            button={(onClick) => (
              <div className="mt-1 cursor-pointer text-right text-xs text-arrd-highlight" onClick={onClick}>
                + {events.length - 1} autres
              </div>
            )}
          >
            {() => (
              <div className="flex max-h-[75vh] flex-col gap-2 overflow-auto p-3">
                {events.map((event) => (
                  <EventProvider event={event} key={event._id.toString()}>
                    <EventLink />
                  </EventProvider>
                ))}
              </div>
            )}
          </Modal>
        )}
      </div>
    </div>
  )
}
