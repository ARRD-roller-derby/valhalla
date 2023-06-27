import { EventProvider, ROLES_CAN_CREATE_EVENT, useEvents } from '@/entities'
import { ICallDay } from '@/hooks'
import { checkRoles, dc } from '@/utils'
import dayjs from 'dayjs'
import { EventCreateModal } from '@/components'
import { useSession } from 'next-auth/react'
import { EventLink } from '../event/event-link'
import { Modal } from '@/ui'

interface CalDayDesktopProps {
  day: ICallDay
}

export function CalDayDesktop({ day }: CalDayDesktopProps) {
  const { data: session } = useSession()
  const user = session?.user
  const { getEventForDay } = useEvents()
  const events = getEventForDay(day.date)
  const noEvent = events.length === 0

  if (!user) return null
  const canSee = checkRoles(ROLES_CAN_CREATE_EVENT, user)

  //TODO on ouvre la modale des events si on clique dessus, mais sur le jour et sur "aucun", ou ouvre la modal de création d'event
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
