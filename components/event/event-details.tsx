import { useEvent } from '@/entities'
import dayjs from 'dayjs'
import { ReadEditor } from '../editor'

import dynamic from 'next/dynamic'
import { EventOrgaDetails } from './event-orga-details'
import { EventCancelBtn } from './event-cancel.button'
import { DangerZone } from '@/ui'
import { EventDeleteBtn } from './event-delete.button'

const Map = dynamic(() => import('../../ui/map').then((mod) => mod.Map), { ssr: false })

export function EventDetails() {
  const { event } = useEvent()
  const isOneDay = dayjs(event.start).isSame(event.end, 'day')

  return (
    <div className="relative grid h-full grid-rows-[1fr]">
      <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex w-full flex-col items-start gap-3 overflow-auto p-2 sm:min-w-[500px] sm:max-w-[600px]">
        {isOneDay ? (
          <div className="flex flex-wrap justify-between gap-2">
            <div>Le {dayjs(event.start).format('LL')}</div>
            <div className="text-arrd-highlight">
              {dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            <div>Du</div>
            <div>
              {dayjs(event.start).format('LLL')}
              {' à '}
              <span className="text-arrd-highlight">{dayjs(event.start).format('HH:mm')}</span>
            </div>
            <div>au</div>
            <div>
              {dayjs(event.end).format('LL')}
              {' à '}
              <span className="text-arrd-highlight">{dayjs(event.end).format('HH:mm')}</span>
            </div>
          </div>
        )}
        <EventOrgaDetails />
        {event.description && <ReadEditor content={event.description} fullHeight />}
        {event.address?.lat && event.address?.lon && (
          <div className="h-60 w-full pr-8 sm:px-0">
            <Map {...event.address} />{' '}
          </div>
        )}

        <DangerZone>
          <div className="flex w-full justify-between gap-2 text-xs">
            <EventDeleteBtn />
            <EventCancelBtn />
          </div>
        </DangerZone>
      </div>
    </div>
  )
}
