import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { MongoDb } from '@/db'
import dayjs from 'dayjs'
import { checkRoles } from '@/utils/check-roles'
import { Event, IParticipant } from '@/models'

export default async function eventsMonth(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  const month = parseInt(req.query.month as string)
  await MongoDb()
  const startOfMonth = dayjs().month(month).startOf('month').toISOString()
  const endOfMonth = dayjs().month(month).endOf('month').toISOString()
  const isMember = checkRoles(['member'], user)
  const isAdmin = checkRoles(['bureau', 'dev'], user)
  const between = {
    start: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  }
  const or = []

  if (!isMember) {
    or.push({
      ...between,
      visibility: 'member',
    })
  } else if (isMember && !isAdmin) {
    or.push({
      ...between,
      visibility: {
        $in: ['member', 'public'],
      },
    })
  }

  if (isAdmin) {
    or.push({
      ...between,
      visibility: 'admin',
    })
  }

  const events = await Event.find({ $or: or })

  //Il ne faut pas retourner les participants, seulement ma présence
  const eventsWithoutParticipants = events.map((event) => {
    const { participants, ...rest } = event.toObject()
    return {
      ...rest,
      participants: participants.filter(
        (participant: IParticipant) => participant.userId === user._id
      ),
    }
  })

  return res.status(200).json(eventsWithoutParticipants)
}
