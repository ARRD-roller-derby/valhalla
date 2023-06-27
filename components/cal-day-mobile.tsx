import { useEvents } from '@/entities'
import { ICallDay } from '@/hooks'
import { dc } from '@/utils'
import dayjs from 'dayjs'

interface CalDayMobileProps {
  day: ICallDay
}

export function CalDayMobile({ day }: CalDayMobileProps) {
  const { getEventForDay, currentDay, setCurrentDay } = useEvents()
  const events = getEventForDay(day.date)
  return (
    <div
      className={dc(
        'rounded-full flex justify-center items-center relative  h-8 w-8',
        [
          day.isCurrentMonth,
          'text-txtLight',
          'bg-bg opacity-50 cursor-not-allowed',
        ],
        [dayjs().isSame(day.date, 'day'), 'bg-second', 'bg-arrd'],
        [
          !!currentDay && dayjs(currentDay).isSame(day.date, 'day'),
          'ring-4 ring-tierce ',
        ]
      )}
      onClick={() => setCurrentDay(day.date)}
    >
      {day.date.format('DD')}
      {day.isCurrentMonth && events.length > 0 && (
        <div className="absolute -top-1 -right-1 text-xs font-semibold  cursor-pointer bg-second h-4 w-4 rounded-full flex justify-center items-center">
          {events.length}
        </div>
      )}
    </div>
  )
}
