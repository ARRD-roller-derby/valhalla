// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { Event, IUser } from '@/models'
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

import { midgardMiddleWare } from '@/utils/midgard-middleware'
import { checkRoles, ROLES } from '@/utils'
import { getDiscordMember } from '@/services/get-discord-member'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

async function nextEvent(req: NextApiRequest, res: NextApiResponse, user: IUser) {
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

  if (visibility === 'dev') {
    const canSee = checkRoles([ROLES.dev], user)
    if (!canSee) return res.status(403).send('non autorisé')
  }

  const { members } = await getDiscordMember()
  return res.status(200).json({
    ...event._doc,
    participants: event.participants.map((par: any) => {
      const user = par._doc || par
      const m = members.find((member) => member.id === user.userId)

      return {
        ...user,
        avatar: m?.avatar,
        name: m?.username || m?.global_name || m?.name || par.name,
        providerAccountId: m?.providerAccountId,
      }
    }),
    carpooling: event.carpooling.map((carpool: any) => {
      return {
        ...carpool,
        participants: carpool.participants.map((participant: any) => {
          const user = participant._doc || participant
          const m = members.find((member) => member.id === user.userId)

          return {
            ...user,
            avatar: m?.avatar,
            name: m?.username || m?.global_name || m?.name || participant.name,
            providerAccountId: m?.providerAccountId,
          }
        }),
      }
    }),
  })
}

const helper = (request: NextApiRequest, response: NextApiResponse) => midgardMiddleWare(request, response, nextEvent)

export default helper
