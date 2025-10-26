import { NextApiRequest, NextApiResponse } from 'next'
process.env.TZ = 'Europe/Paris'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'
import { authMiddleWare } from '@/utils/auth-middleware'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

async function me(_req: NextApiRequest, res: NextApiResponse, user: any) {
  return res.status(200).json(user)
}

export default (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, me)
