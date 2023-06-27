import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Event } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { ROLES, checkRoles, publicParticipants } from '@/utils'
import { TriggerTypes } from '@/entities'
import { publishToDiscord, trigger } from '@/services'
import dayjs from 'dayjs'
process.env.TZ = 'Europe/Paris'

export default async function event_delete(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  if (!user) return res.status(403).send('non autorisé')

  const canCancel = checkRoles([ROLES.coach, ROLES.evenement, ROLES.bureau, ROLES.dev], user)
  if (!canCancel) return res.status(403).send('non autorisé')

  await MongoDb()
  const event = await Event.findOne({ _id: req.query.id })
  if (!event) return res.status(404).send('Événement non trouvé')
  await event.deleteOne()

  trigger('public', TriggerTypes.EVENT, {
    value: {
      delete: event._id,
    },
  })

  const msg = `---\n l'événement **${'`'}${event.title}${'`'}** du ${dayjs(event.start).format(
    'LLLL'
  )} est **SUPPRIMÉ** \n---`
  publishToDiscord('logs', msg)

  return res.status(200).json({
    event: {
      ...event.toJSON(),
      participants: publicParticipants(event, user),
    },
  })
}
