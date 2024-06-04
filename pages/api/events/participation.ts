import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
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
import { authMiddleWare } from '@/utils/auth-middleware'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

async function event_participation(req: NextApiRequest, res: NextApiResponse, user: any) {
  const form = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
  if (!form.eventId || !form.participation) return res.status(400).send('Il manque des informations')
  await MongoDb()
  const event = await Event.findOne({ _id: form.eventId })
  if (!event) return res.status(404).send('Événement non trouvé')
  if (!event.participants) event.participants = []
  const participantEvt = event.participants.find((p: IParticipant) => p.userId === user.id)

  if (!participantEvt) {
    event.participants.push({
      userId: user.id,
      status: 'présent',
      name: user.nickname || user.name,
      type: form.participation,
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate(),
      guestsNumber: form.guestsNumber || 0,
    })
    bank(user.id, 15, 1)
  } else {
    participantEvt.name = user.nickname || user.name

    if (form.participation.match(/absent/)) {
      participantEvt.status = 'absent.e'
    } else {
      participantEvt.status = 'présent'
    }
    participantEvt.type = form.participation
    participantEvt.guestsNumber = form.guestsNumber || 0
    participantEvt.updatedAt = dayjs().toDate()

    event.participants = event.participants.map((p: IParticipant) => {
      if (p.userId === user.id) return participantEvt
      return p
    })
  }
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
      (p: IParticipant) => !p.status.match(/abs|conf/) && !p.type.match(/abs/)
    ).length
    const msg = `---\n**${capitalizeFirstLetter(user.nickname || user.name)}** vient de **${
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

export default (request: NextApiRequest, response: NextApiResponse) =>
  authMiddleWare(request, response, event_participation)
