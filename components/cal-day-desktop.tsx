import { ROLES_CAN_CREATE_EVENT, useEvents } from '@/entities'
import { ICallDay } from '@/hooks'
import { checkRoles, dc } from '@/utils'
import dayjs from 'dayjs'
import { EventModal } from './event-modal'
import { useSession } from 'next-auth/react'

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
        'relative border  p-2 rounded-md h-24',
        [day.isCurrentMonth, 'text-txtLight', 'opacity-50 cursor-not-allowed'],
        [dayjs().isSame(day.date, 'day'), 'border-arrd', 'border-border']
      )}
    >
      <EventModal
        day={day.date}
        customButton={(onClick) => (
          <div
            className="absolute top-1 right-0 pr-1 text-xs font-semibold  cursor-pointer w-full text-right"
            onClick={canSee ? onClick : undefined}
          >
            {day.date.format('DD')}
          </div>
        )}
      />

      <div className="text-xs flex flex-col pt-6 h-full">
        {noEvent && canSee && (
          <EventModal
            day={day.date}
            customButton={(onClick) => (
              <div
                className="text-gray-500 cursor-pointer flex-grow"
                onClick={onClick}
              />
            )}
          />
        )}
        {events.length > 0 && (
          <div className="bg-second text-white p-1 rounded truncate">
            {events[0].title || events[0].type}
          </div>
        )}
        {events.length > 1 && (
          <div className="text-gray-500 text-xs">
            {events.length - 1} autres
          </div>
        )}
      </div>
    </div>
  )
}
