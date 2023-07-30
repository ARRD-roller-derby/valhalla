import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import dayjs from 'dayjs'
import { checkRoles } from '@/utils/check-roles'
import { Event } from '@/models'
import { authOptions } from '../auth/[...nextauth]'
import { publicParticipants } from '@/utils'
process.env.TZ = 'Europe/Paris'

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
  const events = await Event.find({ $or: or }).sort({ start: 1 })

  const eventsWithoutParticipants = events.map((event) => {
    const { participants, ...rest } = event.toObject()
    return {
      ...rest,
      participants: publicParticipants(event, user),
    }
  })
  return res.status(200).json({ events: eventsWithoutParticipants })
}
