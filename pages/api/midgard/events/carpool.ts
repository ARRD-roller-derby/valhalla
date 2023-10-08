// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
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

import { midgardMiddleWare } from '@/utils/midgard-middleware'
import { IUser } from '@/models'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

async function carpool(_req: NextApiRequest, res: NextApiResponse, user: IUser) {
  const start = dayjs().toISOString()
  const latestEvent = await Event.findOne({
    start: { $gte: start },
    'participants.userId': user._id,
    'participants.status': 'présent',
  }).sort({ start: 1 })

  return res.status(200).json(latestEvent)
}

const helper = (request: NextApiRequest, response: NextApiResponse) => midgardMiddleWare(request, response, carpool)

export default helper
