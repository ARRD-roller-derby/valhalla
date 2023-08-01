// Bibliothèques externes
import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { EventCreateModal, EventLink } from '@/components'
import { EventProvider, ROLES_CAN_CREATE_EVENT, useEvents } from '@/entities'
import { ICallDay } from '@/hooks'
import { checkRoles, dc } from '@/utils'
import { Modal } from '@/ui'

interface CalDayDesktopProps {
  day: ICallDay
}

export function CalDayDesktop({ day }: CalDayDesktopProps) {
  // stores
  const { data: session } = useSession()
  const { getEventForDay } = useEvents()

  // const
  const events = getEventForDay(day.date)
  const noEvent = events.length === 0
  const canSee = useMemo(() => {
    if (!session?.user) return false
    return checkRoles(ROLES_CAN_CREATE_EVENT, session.user)
  }, [session])

  return (
    <div
      className={dc(
        'relative h-24  rounded-md border p-1',
        [day.isCurrentMonth, 'text-arrd-textLight', 'cursor-not-allowed opacity-50'],
        [dayjs().isSame(day.date, 'day'), 'border-arrd-accent', 'border-arrd-border']
      )}
    >
      <EventCreateModal
        day={day.date}
        customButton={(onClick) => (
          <div
            className="absolute right-0 top-1 w-full cursor-pointer pr-1 text-right text-xs font-semibold"
            onClick={canSee ? onClick : undefined}
          >
            {day.date.format('DD')}
          </div>
        )}
      />

      <div className="flex h-full flex-col pt-6 text-xs">
        {noEvent && canSee && (
          <EventCreateModal
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
