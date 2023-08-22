import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { checkRoles } from '@/utils/check-roles'
import { Event } from '@/models'
import { authOptions } from '../auth/[...nextauth]'
import { createEvents } from 'ics'
process.env.TZ = 'Europe/Paris'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

export default async function eventsNext(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const start = dayjs().startOf('day').toISOString()
  const isMember = checkRoles(['membre'], user)
  const isAdmin = checkRoles(['bureau', 'dev'], user)
  const between = {
    start: {
      $gte: start,
    },
  }
  const or = []

  if (!isMember) {
    or.push({
      ...between,
      visibility: 'public',
    })
  } else if (isMember && !isAdmin) {
    or.push({
      ...between,
      visibility: {
        $in: ['membre', 'public'],
      },
    })
  }

  if (isAdmin) {
    or.push({
      ...between,
    })
  }

  await MongoDb()
  const events = await Event.find({
    $and: [
      {
        start: {
          $gte: dayjs().startOf('day').toISOString(),
        },
      },
      {
        'participants.status': 'présent',
      },
      {
        'participants.userId': session.user.id,
      },
    ],
  })

  const { error, value } = createEvents(
    events.map((event) => {
      // [2000, 1, 5, 10, 0] (January 5, 2000)
      const startStr = dayjs(event.start).format('YYYY, M, D, H, m')
      const start: [number, number, number, number, number] = startStr.split(',').map((s) => parseInt(s, 10)) as any

      const durationValue = dayjs(event.end).diff(dayjs(event.start), 'minute')
      const duration = { minutes: durationValue }
      const protocol = req.headers['x-forwarded-proto'] || 'https'
      const baseUrl = `${protocol}://${req.headers.host}`
      return {
        title: event?.title || event.type,
        start,
        duration,
        url: `${baseUrl}/events/${event._id}`,
      }
    })
  )

  if (error) return res.status(500).json({ error })

  return res.status(200).json({ ics: value })
}
