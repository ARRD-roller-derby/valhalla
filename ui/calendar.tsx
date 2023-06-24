import { useCalendar } from '@/hooks/calendar.hook'
import useIsMobile from '@/hooks/is-mobile.hook'
import dayjs from 'dayjs'

export function Calendar() {
  const { cal, nextMonth, currentMonth, previousMonth } = useCalendar()
  const isMobile = useIsMobile()
  const daysOfWeek = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ]

  return (
    <div className="p-4 bg-color-bg-light rounded-lg shadow-md">
      {/* Navigation et mois courant */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={previousMonth}
          className="bg-arrd text-white px-4 py-2 rounded-md"
        >
          Précédent
        </button>
        <div className="text-xl font-bold text-second">{currentMonth}</div>
        <button
          onClick={nextMonth}
          className="bg-arrd text-white px-4 py-2 rounded-md"
        >
          Suivant
        </button>
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-2">
        {/* Headers pour les jours de la semaine */}
        {daysOfWeek.map((day) => (
          <div key={day} className="font-bold text-center text-second">
            {isMobile ? day.slice(0, 3) : day}
          </div>
        ))}

        {/* Jours */}
        {cal.map((day) => (
          <div
            key={dayjs(day.date).format('DD-MM-YYYY')}
            className={`relative border border-border p-2 rounded-md h-24 ${
              day.isCurrentMonth ? 'bg-bgDark text-txt' : 'opacity-50'
            }`}
          >
            {/* Jour */}
            <div className="absolute top-1 right-1 text-xs font-semibold text-txtLight">
              {dayjs(day.date).format('DD')}
            </div>

            {/* Evénements */}
            <div className="mt-2 text-xs flex flex-col space-y-1 pt-6">
              {/* Exemple d'événements */}
              <div className="bg-second text-white p-1 rounded truncate">
                Evénement 1
              </div>
              {/* Indiquer le nombre d'événements supplémentaires (si nécessaire) */}
              <div className="text-gray-500 text-xs">+3 autres événements</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
