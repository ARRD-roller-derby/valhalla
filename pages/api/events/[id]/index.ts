import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Event } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { ROLES, checkRoles } from '@/utils'
process.env.TZ = 'Europe/Paris'

export default async function event_findOne(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  if (!user) return res.status(403).send('non autorisé')

  await MongoDb()
  const event = await Event.findOne({ _id: req.query.id })
  if (!event) return res.status(404).send('Événement non trouvé')

  const visibility = event.visibility.toLowerCase()
  if (visibility === 'membre') {
    const canSee = checkRoles([ROLES.membre], user)
    if (!canSee) return res.status(403).send('non autorisé')
  }

  if (visibility === 'bureau') {
    const canSee = checkRoles([ROLES.bureau], user)
    if (!canSee) return res.status(403).send('non autorisé')
  }

  if (visibility === 'admin') {
    const canSee = checkRoles([ROLES.bureau, ROLES.dev], user)
    if (!canSee) return res.status(403).send('non autorisé')
  }

  return res.status(200).json({
    event,
  })
}
