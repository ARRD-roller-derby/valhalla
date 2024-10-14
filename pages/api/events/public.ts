import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { Event } from '@/models'
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

export default async function eventsPublic(_req: NextApiRequest, res: NextApiResponse) {
  await MongoDb()
  const events = await Event.find({
    $and: [{ start: { $gte: dayjs().startOf('day').toISOString() } }, { visibility: '@everyone' }],
  }).sort({ start: 1 })

  return res.status(200).json(events)
}
