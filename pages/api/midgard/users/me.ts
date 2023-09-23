// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { checkRoles } from '@/utils/check-roles'
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

async function me(_req: NextApiRequest, res: NextApiResponse, user: IUser) {
  return res.status(200).json(user)
}

const helper = (request: NextApiRequest, response: NextApiResponse) => midgardMiddleWare(request, response, me)

export default helper
