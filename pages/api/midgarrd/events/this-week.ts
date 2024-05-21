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

async function thisWeek(_req: NextApiRequest, res: NextApiResponse, user: IUser) {
  const start = dayjs().toISOString()
  const isMember = checkRoles(['membre'], user)
  const isAdmin = checkRoles(['bureau', 'dev'], user)

  const roles = user.roles.map((role: any) => role.name)

  const between = {
    start: {
      $gte: start,
      $lte: dayjs().endOf('week').toISOString(),
    },
  }
  const or = []

  if (roles.length > 0) {
    or.push({
      ...between,
      visibility: {
        $in: roles,
      },
    })
  }

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
  const events = await Event.find({ $or: or })
  return res.status(200).json({ events })
}

const helper = (request: NextApiRequest, response: NextApiResponse) => midgardMiddleWare(request, response, thisWeek)

export default helper
