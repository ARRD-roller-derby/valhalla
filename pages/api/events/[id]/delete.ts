import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Event } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { ROLES, checkRoles, publicParticipants } from '@/utils'
import { TriggerTypes } from '@/entities'
import { publishToDiscord, trigger } from '@/services'
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

  await trigger('public', TriggerTypes.EVENT, {
    value: {
      delete: event._id,
    },
  })

  const msg = `---\n l'événement **${'`'}${event.title}${'`'}** du ${dayjs(event.start).format(
    'LLLL'
  )} est **SUPPRIMÉ** \n---`

  await publishToDiscord('logs', msg)

  return res.status(200).json({
    event: {
      ...event.toJSON(),
      participants: publicParticipants(event, user),
    },
  })
}
