import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Event, Purchase } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { PURCHASE_TYPES, ROLES_CAN_MANAGE_EVENT, checkRoles } from '@/utils'
process.env.TZ = 'Europe/Paris'

export default async function event_participants(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  if (!user) return res.status(403).send('non autorisé')

  const canSee = checkRoles(ROLES_CAN_MANAGE_EVENT, user)

  if (!canSee) {
    // rechercher un purchase de type spyAttendees dans l'heure
    const lastPurchase = await Purchase.count({
      userId: user.id,
      name: PURCHASE_TYPES.spyAttendees,
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    })

    if (lastPurchase === 0)
      return res.status(200).json({
        participants: [],
      })
  }
  await MongoDb()

  const event = await Event.findOne({ _id: req.query.id })
  if (!event) return res.status(404).send('Événement non trouvé')
  return res.status(200).json({
    participants: event.participants || [],
  })
}
