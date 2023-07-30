import { ROLES_CAN_CREATE_EVENT, TriggerTypes, useEvents, useSocketTrigger } from '@/entities'
import { useIsMobile, useCalendar } from '@/hooks'
import { Button } from '@/ui'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'
import { CalDayDesktop, CalDayMobile, CalEventForDay, EventCreateModal } from '@/components'
import { checkRoles, dc } from '@/utils'
import { useSession } from 'next-auth/react'
import { IEvent } from '@/models'

export function Calendar() {
  const isMobile = useIsMobile()
  const { data: session } = useSession()
  const user = session?.user
  const { events, currentDay, socketEvt, fetchForCal } = useEvents()
  const { cal, currentMonth, currentMonthNum, nextMonth, previousMonth } = useCalendar()

  useSocketTrigger<{ event: IEvent }>(TriggerTypes.EVENT, socketEvt)
  const calWithEvents = useMemo(() => {
    return cal.map((day) => {
      const dayEvents = events.filter((event) => {
        return dayjs(event.start).isSame(day.date, 'day')
      })

      return { ...day, events: dayEvents }
    })
  }, [cal, events])

  useEffect(() => {
    fetchForCal(currentMonthNum)
  }, [fetchForCal, currentMonthNum])

  if (!user) return null
  const canSee = checkRoles(ROLES_CAN_CREATE_EVENT, user)

  return (
    <div className="rounded-lg p-4">
      <div className="mb-4 grid grid-cols-[auto_1fr_auto] items-center justify-center">
        <Button text="Précédent" onClick={previousMonth} />
        <div className="text-center font-bold text-arrd-highlight first-letter:uppercase md:text-xl">
          {currentMonth}
        </div>
        <Button text="Suivant" onClick={nextMonth} />
      </div>

      <div className={dc([isMobile, 'grid h-full grid-rows-[auto_1fr] gap-2'])}>
        <div className={dc('grid grid-cols-7', [isMobile, 'gap-3', 'gap-1'])}>
          {Array.from({ length: 7 }, (_, i) => i + 1).map((numDay) => (
            <div key={numDay} className="text-second text-center font-bold">
              {dayjs()
                .day(numDay)
                .format(isMobile ? 'ddd' : 'dddd')}
            </div>
          ))}

          {calWithEvents.map((day) =>
            isMobile ? (
              <CalDayMobile day={day} key={dayjs(day.date).format('DD-MM-YYYY')} />
            ) : (
              <CalDayDesktop day={day} key={dayjs(day.date).format('DD-MM-YYYY')} />
            )
          )}
        </div>

        {isMobile && currentDay && (
          <div className="flex flex-col gap-4 py-4">
            {canSee && (
              <EventCreateModal customButton={(onClick) => <Button text="Créer un évènement" onClick={onClick} />} />
            )}
            <CalEventForDay />
          </div>
        )}
      </div>
    </div>
  )
}
