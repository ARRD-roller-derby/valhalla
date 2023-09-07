import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Event } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

export default async function event_participants(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  if (!user) return res.status(403).send('non autorisé')

  await MongoDb()

  const event = await Event.findOne({ _id: req.query.id })

  if (!event) return res.status(404).send('Événement non trouvé')
  return res.status(200).json({
    participants: event.participants,
  })
}
