// Bibliothèques externes
import dayjs from 'dayjs'
import Link from 'next/link'

// Bibliothèques internes
import { useEvent } from '@/entities'
import { ReadEditor, EventOrgaDetails, EventParticipation, WeatherWidget } from '@/components'
import { ArrowLeftIcon, CancelMsg, Card } from '@/ui'

export function EventCard() {
  // Stores -------------------------------------------------------------------
  const { event } = useEvent()

  // Constantes ----------------------------------------------------------------
  const isOneDay = dayjs(event.start).isSame(event.end, 'day')

  // Rendu ---------------------------------------------------------------------
  return (
    <Card>
      <div className="grid h-full grid-cols-[auto_1fr] gap-3">
        <div className="flex flex-col items-center ">
          <div className="text-xs">{dayjs(event.start).format('dddd')}</div>
          <div className="text-4xl font-bold text-arrd-highlight">{dayjs(event.start).format('DD')}</div>
          <div className="text-xs">{dayjs(event.start).format('MMMM')}</div>

          <div className="flex flex-col items-center text-sm text-arrd-highlight">
            {dayjs(event.start).format('HH:mm')}
            {isOneDay && (
              <>
                <ArrowLeftIcon className="-rotate-90 fill-arrd-primary" />
                {dayjs(event.end).format('HH:mm')}
              </>
            )}
          </div>

          {!isOneDay && (
            <div className="mt-2 flex flex-col items-center">
              <ArrowLeftIcon className="mb-2 h-4 w-4 -rotate-90 fill-arrd-primary" />
              <div className="text-xs">{dayjs(event.end).format('dddd')}</div>
              <div className="text-4xl font-bold text-arrd-highlight">{dayjs(event.end).format('DD')}</div>
              <div className="text-xs">{dayjs(event.end).format('MMMM')}</div>

              <div className="flex flex-col items-center text-sm text-arrd-highlight">
                {dayjs(event.end).format('HH:mm')}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-rows-[1fr_auto] gap-3">
          <div>
            <Link href={`/agenda/${event._id}`}>
              <div className="text-md rounded border border-arrd-secondary p-2  uppercase text-arrd-textExtraLight">
                {event.title}
              </div>
            </Link>
            {event?.address?.label && (
              <div className="py-2 text-sm italic text-arrd-secondary">{event.address.label}</div>
            )}
            <EventOrgaDetails />
            <div className="text-arrd-textSecondary pb-2 text-sm">
              {event.description && <ReadEditor content={event.description} />}
            </div>
            {event.address?.lat && event.address?.lon && <WeatherWidget />}
          </div>
          {event.cancelled ? <CancelMsg /> : <EventParticipation />}
        </div>
      </div>
    </Card>
  )
}
