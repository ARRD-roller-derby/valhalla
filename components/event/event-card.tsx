// Bibliothèques externes
import dayjs from 'dayjs'
import Link from 'next/link'

// Bibliothèques internes
import { useEvent, useWeather } from '@/entities'
import { ReadEditor, EventOrgaDetails, EventParticipation, WeatherWidget } from '@/components'
import { ArrowLeftIcon, CancelMsg, CardUI, Modal } from '@/ui'
import { EventAttendeesModal } from './event-attendees.modal'
import { useMemo } from 'react'

export function EventCard() {
  // Stores -------------------------------------------------------------------
  const { event } = useEvent()
  const { loading } = useWeather()

  // Constantes ----------------------------------------------------------------
  const isOneDay = dayjs(event.start).isSame(event.end, 'day')
  const start = useMemo(() => dayjs(event.start), [event.start])
  //TODO renvoyer un objet de chaine de caractère, avec tous les formats utilisé
  const end = useMemo(() => dayjs(event.end), [event.end])
  //TODO implementer le calcul de la durée de l'event, et l'afficher dans le composant

  // Rendu ---------------------------------------------------------------------
  return (
    <CardUI>
      <div className="grid h-full grid-cols-[auto_1fr] gap-3">
        <Modal
          title="Liste des participants"
          button={(onClick) => (
            <div className="flex cursor-pointer flex-col items-center" onClick={onClick}>
              <div className="text-xs">{start.format('dddd')}</div>
              <div className="text-4xl font-bold text-arrd-highlight">{start.format('DD')}</div>
              <div className="text-xs">{start.format('MMMM')}</div>

              <div className="flex flex-col items-center text-sm text-arrd-highlight">
                {start.format('HH:mm')}
                {isOneDay && (
                  <>
                    <ArrowLeftIcon className="-rotate-90 fill-arrd-primary" />
                    {end.format('HH:mm')}
                  </>
                )}
              </div>

              {!isOneDay && (
                <div className="mt-2 flex flex-col items-center">
                  <ArrowLeftIcon className="mb-2 h-4 w-4 -rotate-90 fill-arrd-primary" />
                  <div className="text-xs">{end.format('dddd')}</div>
                  <div className="text-4xl font-bold text-arrd-highlight">{end.format('DD')}</div>
                  <div className="text-xs">{end.format('MMMM')}</div>

                  <div className="flex flex-col items-center text-sm text-arrd-highlight">{end.format('HH:mm')}</div>
                </div>
              )}
            </div>
          )}
        >
          {() => <EventAttendeesModal />}
        </Modal>

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
            <div className="text-arrd-textSecondary text-sm">
              {event.description && <ReadEditor content={event.description} />}
            </div>
            {event.address?.lat && event.address?.lon && !loading && <WeatherWidget />}
          </div>
        </div>
        <div className="col-span-full flex flex-col content-stretch justify-around border-t-[1px] border-arrd-bg pt-2">
          {event.cancelled ? <CancelMsg /> : <EventParticipation />}
        </div>
      </div>
    </CardUI>
  )
}
