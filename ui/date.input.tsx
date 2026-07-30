// Bibliothèques externes
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import dayjs from 'dayjs'

// Bibliothèques internes
import { ChevronLeftIcon, ChevronRightIcon } from '@/ui'
import { useCalendar } from '@/hooks'
import { dc } from '@/utils'

interface DateInputProps {
  date?: dayjs.Dayjs
  setDate: (value: dayjs.Dayjs) => void
}

export function DateInput({ date = dayjs(), setDate }: DateInputProps) {
  // stores
  const { cal, previousMonth, nextMonth, currentMonth } = useCalendar()

  // const
  const iconClasses = 'w-6 h-6 cursor-pointer fill-arrd-primary hover:fill-arrd-highlight'

  return (
    <Popover as="div" className="relative inline-block text-left">
      <div>
        <Popover.Button className="input flex gap-1">{date.format('DD/MM/YYYY')}</Popover.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel
          className="z-40  mt-1 flex  w-full min-w-[250px] flex-col gap-1 overflow-auto rounded border border-arrd-accent
        bg-arrd-bg text-left align-middle text-base shadow-xl ring-1 ring-arrd-accent"
        >
          {({ close }) => (
            <div className="flex flex-col items-center gap-2 p-5">
              <div className="mb-4 grid w-full grid-cols-[auto_1fr_auto] items-center">
                <button type="button" aria-label="Mois précédent" className="border-0 bg-transparent p-0" onClick={previousMonth}>
                  <ChevronLeftIcon className={iconClasses} />
                </button>

                <div className="text-center font-bold text-arrd-highlight first-letter:uppercase md:text-xl">
                  {currentMonth}
                </div>
                <button type="button" aria-label="Mois suivant" className="border-0 bg-transparent p-0" onClick={nextMonth}>
                  <ChevronRightIcon className={iconClasses} />
                </button>
              </div>
              <div className="inline-grid grid-cols-7 gap-2">
                {cal.map((day) => (
                  <button
                    type="button"
                    key={day.date.toString()}
                    onClick={() => {
                      setDate(day.date)
                      close()
                    }}
                    className={dc(
                      'hover:text-tierce relative flex h-6 w-6 items-center justify-center rounded-full border-0 bg-transparent p-0',
                      [!day.isCurrentMonth, 'cursor-not-allowed opacity-50'],
                      [
                        dayjs().isSame(day.date, 'day'),
                        'font-bold text-arrd-textExtraLight underline',
                        'text-arrd-textLight',
                      ],
                      [dayjs(date).isSame(day.date, 'day'), 'ring-2 ring-arrd-secondary ']
                    )}
                  >
                    {day.date.format('DD')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
