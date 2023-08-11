import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { checkRoles } from '@/utils/check-roles'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Address, Event } from '@/models'
import { uuid } from 'uuidv4'
import { publishToDiscord } from '@/services/publish-to-discord'
import { tiptapJsonToMd } from '@/utils/tiptap-json-to-md'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'
import { ROLES_CAN_CREATE_EVENT } from '@/entities'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

process.env.TZ = 'Europe/Paris'

export default async function event_create(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  const isCanView = checkRoles(ROLES_CAN_CREATE_EVENT, user)
  if (!isCanView) return res.status(403).send('non autorisé')
  const form = JSON.parse(req.body || '{}')
  await MongoDb()

  const { start, end, description, title, type, visibility, address } = form

  let populatedAddress = 0

  const recurrenceId = uuid()
  const eventParams = {
    start,
    end,
    description,
    recurrenceId,
    title,
    type,
    visibility,
    address,
    participants: [],
    cancelled: false,
  }

  const creatableEvents = [eventParams]

  if (form.recurrence) {
    const { frequency, count } = form.recurrence
    const start = dayjs(eventParams.start)
    const end = dayjs(eventParams.end)
    for (let i = 1; i < parseInt(count); i++) {
      populatedAddress
      creatableEvents.push({
        ...eventParams,
        start: start.add(i, frequency).toISOString(),
        end: end.add(i, frequency).toISOString(),
      })
    }
  }
  const events = await Event.create(creatableEvents)

  if (address) {
    const existedAddr = await Address.findOne({ label: address.label })
    // On attend pas la réponse, on en a pas besoin
    if (existedAddr) {
      existedAddr.popularity += populatedAddress
      existedAddr.save()
    } else {
      Address.create({ ...address, popularity: populatedAddress })
    }
  }

  events.slice(0, 5).forEach((event) => {
    let markdown = `# ${event.title}\n\n`
    if (event.start) {
      markdown += `*Date: ${dayjs(event.start).format('LLLL')}*\n`
    }

    if (event.address?.label) {
      markdown += `### Adresse\n${event.address.label}\n`
    }

    if (description) {
      markdown += tiptapJsonToMd(description.content)
    }
    markdown += `\n[Voir l'événement](${req.headers.origin}/agenda/${event._id})`

    publishToDiscord('event', markdown)
  })

  return res.status(200).json({ events })
}
