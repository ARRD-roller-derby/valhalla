// Bibliothèques externes
import dayjs from 'dayjs'
import Link from 'next/link'

// Bibliothèques internes
import { useEvent } from '@/entities'
import { dc } from '@/utils'

interface EventLinkProps {
  small?: boolean
}
export function EventLink({ small = false }: EventLinkProps) {
  // Stores -----------------------------------------------------------------
  const { event } = useEvent()

  // Rendu ------------------------------------------------------------------
  return (
    <Link
      href={`/agenda/${event._id}`}
      key={event._id.toString()}
      className={dc('rounded border border-arrd-secondary text-arrd-textExtraLight', [small, 'p-1', 'p-2'])}
    >
      <span className="text-arrd-highlight">{dayjs(event.start).format('HH:mm')}</span>
      <span className="text-arrd-secondary"> | </span>
      {event.title}
    </Link>
  )
}
