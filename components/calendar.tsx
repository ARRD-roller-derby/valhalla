import { ROLES_CAN_CREATE_EVENT, useEvents } from '@/entities'
import { useIsMobile, useCalendar } from '@/hooks'
import { Button } from '@/ui'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'
import { CalDayDesktop, CalDayMobile } from '@/components'
import { checkRoles, dc } from '@/utils'
import { EventModal } from './event-modal'
import { useSession } from 'next-auth/react'

export function Calendar() {
  const isMobile = useIsMobile()
  const { data: session } = useSession()
  const user = session?.user
  const { events, currentDay, fetchForCal } = useEvents()
  const { cal, currentMonth, currentMonthNum, nextMonth, previousMonth } =
    useCalendar()
  const calWithEvents = useMemo(() => {
    return cal.map((day) => {
      const dayEvents = events.filter((event) => {
        return dayjs(event.start).isSame(day.date, 'day')
      })

      //TODO voir si le format est bon ?
      return { ...day, events: dayEvents }
    })
  }, [cal, events])

  useEffect(() => {
    fetchForCal(currentMonthNum)
  }, [fetchForCal, currentMonthNum])

  if (!user) return null
  const canSee = checkRoles(ROLES_CAN_CREATE_EVENT, user)

  return (
    <div className="p-4 bg-color-bg-light rounded-lg">
      <div className="grid grid-cols-[auto_1fr_auto] items-center justify-center mb-4">
        <Button text="Précédent" onClick={previousMonth} />
        <div className="font-bold text-tierce text-center first-letter:uppercase md:text-xl">
          {currentMonth}
        </div>
        <Button text="Suivant" onClick={nextMonth} />
      </div>

      <div className={dc([isMobile, 'grid grid-rows-[auto_1fr] gap-2 h-full'])}>
        <div className={dc('grid grid-cols-7', [isMobile, 'gap-3', 'gap-1'])}>
          {Array.from({ length: 7 }, (_, i) => i + 1).map((numDay) => (
            <div key={numDay} className="font-bold text-center text-second">
              {dayjs()
                .day(numDay)
                .format(isMobile ? 'ddd' : 'dddd')}
            </div>
          ))}

          {calWithEvents.map((day) =>
            isMobile ? (
              <CalDayMobile
                day={day}
                key={dayjs(day.date).format('DD-MM-YYYY')}
              />
            ) : (
              <CalDayDesktop
                day={day}
                key={dayjs(day.date).format('DD-MM-YYYY')}
              />
            )
          )}
        </div>

        {isMobile && currentDay && (
          <div className="flex flex-col gap-2 py-2">
            {canSee && (
              <EventModal
                day={currentDay}
                customButton={(onClick) => (
                  <Button text="Créer un évènement" onClick={onClick} />
                )}
              />
            )}
            <div>event</div>
          </div>
        )}
      </div>
    </div>
  )
}
