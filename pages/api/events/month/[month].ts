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
import { getDiscordMember } from '@/services/get-discord-member'
import { authMiddleWare } from '@/utils/auth-middleware'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

async function eventsMonth(req: NextApiRequest, res: NextApiResponse, user: any) {
  const roles = user.roles.map((role: any) => role.name)
  const queryMonth = req.query.month as string
  const monthAndYear = queryMonth.split('_')

  const [month, year] = monthAndYear.map((m: string) => parseInt(m))

  const startOfMonth = dayjs().month(month).year(year).startOf('month').toISOString()
  const endOfMonth = dayjs().month(month).year(year).endOf('month').toISOString()
  const isMember = checkRoles(['membre'], user)
  const isAdmin = checkRoles(['bureau', 'dev'], user)

  const between = {
    start: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  }
  const or = []

  if (roles.length > 0) {
    or.push({
      ...between,
      visibility: {
        $in: roles.map((role: string) => new RegExp(role, 'i')),
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
        $in: ['membre', 'public'].map((role: string) => new RegExp(role, 'i')),
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
  const { members } = await getDiscordMember()

  return res.status(200).json({
    events: events.map((event) => {
      return {
        ...event._doc,
        participants: event.participants.map((par: any) => {
          const m = members.find((member) => member.id === par.userId)
          return {
            ...par._doc,
            avatar: m?.avatar,
            name: m?.global_name || m?.username || m?.name,
          }
        }),
      }
    }),
  })
}

export default (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, eventsMonth)
