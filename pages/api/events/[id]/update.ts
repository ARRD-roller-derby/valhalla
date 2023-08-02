// Bibliothèques externes
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'

// Bibliothèques internes
import { authOptions } from '../../auth/[...nextauth]'
import { MongoDb } from '@/db'
import { Address, Event } from '@/models'
import { ROLES, checkRoles, publicParticipants, tiptapJsonToMd } from '@/utils'
import { TriggerTypes } from '@/entities'
import { publishToDiscord, trigger } from '@/services'

// config
process.env.TZ = 'Europe/Paris'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

export default async function event_update(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  if (!user) return res.status(403).send('non autorisé')

  const canCancel = checkRoles([ROLES.coach, ROLES.evenement, ROLES.bureau, ROLES.dev], user)
  if (!canCancel) return res.status(403).send('non autorisé')

  await MongoDb()
  const event = await Event.findOne({ _id: req.query.id })

  if (!event) return res.status(404).send('Événement non trouvé')

  const form = JSON.parse(req.body || '{}')

  if (form?._id) return res.status(404).send('Formulaire non trouvé')

  if (form?.address?.label !== event?.address?.label) {
    const { address } = form
    const existedAddr = await Address.findOne({ label: address.label })
    // On attend pas la réponse, on en a pas besoin
    if (existedAddr) {
      existedAddr.popularity++
      existedAddr.save()
    } else {
      Address.create({ ...address, popularity: 1 })
    }
  }

  await event.updateOne({ ...form, updatedAt: new Date() })

  const newEvent = await Event.findOne({ _id: req.query.id })

  trigger('public', TriggerTypes.EVENT, {
    value: {
      userId: user.id,
      event: {
        ...newEvent.toJSON(),

        participants: publicParticipants(event, user),
      },
    },
  })

  let markdown = `# ${newEvent.title}\n`
  markdown += `${'```'} Cette événement vient d'être modifié ${'```'}\n\n`
  if (newEvent.start) {
    markdown += `*Date: ${dayjs(newEvent.start).format('LLLL')}*\n`
  }

  if (newEvent.address?.label) {
    markdown += `### Adresse\n${event.address.label}\n`
  }

  if (newEvent.description) {
    markdown += tiptapJsonToMd(newEvent.content)
  }
  markdown += `\n[Voir l'événement](${req.headers.origin}/agenda/${event._id})`

  publishToDiscord('event', markdown)

  return res.status(200).json({
    event: {
      ...newEvent.toJSON(),
      participants: publicParticipants(event, user),
    },
  })
}
