import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Event } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { PURCHASE_TYPES, ROLES, checkRoles } from '@/utils'
import { bank } from '@/services'
import { Purchase } from '@/models/purchase.model'
process.env.TZ = 'Europe/Paris'

export default async function event_spy(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  if (!user) return res.status(403).send('non autorisé')

  await MongoDb()

  const event = await Event.findOne({ _id: req.query.id })
  if (!event) return res.status(404).send('Événement non trouvé')

  if (event.visibility === 'membre') {
    const canSee = checkRoles([ROLES.membre], user)
    if (!canSee) return res.status(403).send('non autorisé')
  }

  if (event.visibility === 'bureau') {
    const canSee = checkRoles([ROLES.bureau], user)
    if (!canSee) return res.status(403).send('non autorisé')
  }

  if (event.visibility === 'admin') {
    const canSee = checkRoles([ROLES.bureau, ROLES.dev], user)
    if (!canSee) return res.status(403).send('non autorisé')
  }

  bank(user.id, -35, 1, PURCHASE_TYPES.spyAttendees)
  return res.status(200).json({
    participants: event.participants || [],
  })
}
