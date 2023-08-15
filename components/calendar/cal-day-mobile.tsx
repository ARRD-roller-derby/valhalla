// Bibliothèques externes
import dayjs from 'dayjs'

// Bibliothèques internes
import { useEvents } from '@/entities'
import { ICallDay } from '@/hooks'
import { dc } from '@/utils'

interface CalDayMobileProps {
  day: ICallDay
}

export function CalDayMobile({ day }: CalDayMobileProps) {
  // Stores -------------------------------------------------------------------
  const { getEventForDay, currentDay, setCurrentDay } = useEvents()

  // Constantes --------------------------------------------------------------
  const events = getEventForDay(day.date)

  // Rendu -------------------------------------------------------------------
  return (
    <div
      className={dc(
        'relative flex h-8 w-8 items-center justify-center rounded-full',
        [day.isCurrentMonth, 'text-txtLight', 'bg-bg cursor-not-allowed opacity-50'],
        [dayjs().isSame(day.date, 'day'), 'bg-arrd-accent', 'bg-arrd-bgLight'],
        [!!currentDay && dayjs(currentDay).isSame(day.date, 'day'), 'ring-tierce ring-4 ']
      )}
      onClick={() => setCurrentDay(day.date)}
    >
      {day.date.format('DD')}
      {day.isCurrentMonth && events.length > 0 && (
        <div className="absolute -right-1 -top-1 flex h-4  w-4 cursor-pointer items-center justify-center rounded-full bg-arrd-secondary text-xs font-semibold">
          {events.length}
        </div>
      )}
    </div>
  )
}
