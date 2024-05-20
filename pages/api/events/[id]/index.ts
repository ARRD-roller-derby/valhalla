import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { Event } from '@/models'
import { ROLES, checkRoles } from '@/utils'
import { authMiddleWare } from '@/utils/auth-middleware'
process.env.TZ = 'Europe/Paris'

async function event_findOne(req: NextApiRequest, res: NextApiResponse, user: any) {
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

const helper = (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, event_findOne)

export default helper
