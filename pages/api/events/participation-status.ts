import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Event, IParticipant } from '@/models'
import { capitalizeFirstLetter } from '@/utils'
import { bank, publishToDiscord, trigger } from '@/services'
import { TriggerTypes } from '@/entities'
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

export default async function event_participation_status(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  const form = JSON.parse(req.body || '{}')
  if (!form.eventId || !form.status) return res.status(400).send('Il manque des informations')
  await MongoDb()
  const event = await Event.findOne({ _id: form.eventId })

  if (!event) return res.status(404).send('Événement non trouvé')
  if (!event.participants) event.participants = []
  const participantEvt = event.participants.find((p: IParticipant) => p.userId === user.id)

  if (!participantEvt) return res.status(404).send('Participant non trouvé')

  participantEvt.status = form.status.match(/confirm/) ? 'présent' : 'à confirmer'
  participantEvt.updatedAt = dayjs().toDate()

  event.participants = event.participants.map((p: IParticipant) => {
    if (p.userId === user.id) return participantEvt
    return p
  })

  await event.save()
  const participant = event.participants.find((p: IParticipant) => p.userId === user.id)
  const now = dayjs()
  const threeHoursBeforeStart = dayjs(event.start).subtract(3, 'hours')

  const isBetweenEventAndThreeHoursBeforeStart = now?.isBetween(threeHoursBeforeStart, event.start)

  if (isBetweenEventAndThreeHoursBeforeStart) {
    const newStatus: any = {
      'à confirmer': 'ne pas confirmer',
      'absent.e': "d' annuler",
      absent: "d' annuler",
      present: 'confirmer',
      présent: 'confirmer',
    }

    const confirmParticipantsNum = event.participants.filter(
      (p: IParticipant) => p.status === 'présent' && !p.type.match(/absent|conf/)
    ).length
    const msg = `---\n**${capitalizeFirstLetter(user.name)}** vient de **${
      newStatus[participant.status]
    }** sa participation à l'événement **${'`'}${event.title}${'`'}** du ${dayjs(event.start).format('LLLL')}.
Il y a maintenant **${'`'}${confirmParticipantsNum}${'`'} participant.e.${
      confirmParticipantsNum > 1 ? 's' : ''
    } confirmé.e.${confirmParticipantsNum > 1 ? 's' : ''}** pour cet événement.\n---`

    await publishToDiscord('logs', msg)
  }

  await trigger('public', TriggerTypes.PARTICIPATION, {
    value: {
      eventId: event._id,
    },
  })

  return res.status(200).json({
    event,
    participant,
  })
}
