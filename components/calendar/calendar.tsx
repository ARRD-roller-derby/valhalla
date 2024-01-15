// Bibliothèques externes
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

// Bibliothèques internes
import { TriggerTypes, useEvents, useSocketTrigger } from '@/entities'
import { useIsMobile, useCalendar, useCanSee } from '@/hooks'
import { Button } from '@/ui'
import { useEffect, useMemo } from 'react'
import { CalDayDesktop, CalDayMobile, CalEventForDay, EventFilterButton, EventFormModal } from '@/components'
import { dc } from '@/utils'

// Modèles
import { IEvent } from '@/models'

export function Calendar() {
  // Stores -----------------------------------------------------------------
  const { data: session } = useSession()
  const { events, currentDay, socketEvt, fetchForCal } = useEvents()

  // Hooks ------------------------------------------------------------------
  const { cal, currentMonth, currentYear, currentMonthNum, nextMonth, previousMonth } = useCalendar()
  const isMobile = useIsMobile()
  const { justEventManager } = useCanSee()
  useSocketTrigger<{ event: IEvent }>(TriggerTypes.EVENT, socketEvt)

  // Constantes -------------------------------------------------------------
  const calWithEvents = useMemo(() => {
    return cal.map((day) => {
      const dayEvents = events.filter((event) => {
        return dayjs(event.start).isSame(day.date, 'day')
      })

      return { ...day, events: dayEvents }
    })
  }, [cal, events])

  // Effets -----------------------------------------------------------------
  useEffect(() => {
    fetchForCal(currentMonthNum, currentYear)
  }, [fetchForCal, currentMonthNum])

  // Rendu ------------------------------------------------------------------
  if (!session?.user) return <></>

  return (
    <div className="flex flex-col gap-2 rounded-lg p-2 md:gap-1">
      <EventFilterButton />
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
            {justEventManager && (
              <EventFormModal customButton={(onClick) => <Button text="Créer un évènement" onClick={onClick} />} />
            )}
            <CalEventForDay />
          </div>
        )}
      </div>
    </div>
  )
}
