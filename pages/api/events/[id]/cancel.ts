import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { Event } from '@/models'
import { ROLES_CAN_MANAGE_EVENT, checkRoles } from '@/utils'
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
import { authMiddleWare } from '@/utils/auth-middleware'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

async function event_cancel(req: NextApiRequest, res: NextApiResponse, user: any) {
  const canCancel = checkRoles(ROLES_CAN_MANAGE_EVENT, user)
  if (!canCancel) return res.status(403).send('non autorisé')

  await MongoDb()
  const event = await Event.findOne({ _id: req.query.id })
  if (!event) return res.status(404).send('Événement non trouvé')

  event.cancelled = !event.cancelled
  await event.save()

  await trigger('public', TriggerTypes.EVENT, {
    value: {
      event,
    },
  })

  if (event.cancelled) {
    const msg = `---\n l'événement **${'`'}${event.title}${'`'}** du ${dayjs(event.start).format(
      'LLLL'
    )} est **ANNULÉ** \n---`
    await publishToDiscord('event', msg)
  }

  return res.status(200).json({
    event,
  })
}

export default (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, event_cancel)
