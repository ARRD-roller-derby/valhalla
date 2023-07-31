import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Event, IParticipant } from '@/models'
import { capitalizeFirstLetter, publicParticipants } from '@/utils'
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

export default async function event_participation(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  //const isCanView = checkRoles(['bureau', 'dev', 'evénements', 'coach'], user)
  const form = JSON.parse(req.body || '{}')
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
      name: user.name,
      type: form.participation,
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate(),
      guestsNumber: form.guestsNumber || 0,
    })

    bank(user.id, 15)
  } else {
    if (!participantEvt.name) {
      participantEvt.name = user.name
    }
    if (form.participation === 'absent.e') {
      participantEvt.status = 'absent.e'
      participantEvt.type = form.participation
    } else {
      participantEvt.status =
        form.participation === participantEvt.type && participantEvt.status === 'présent' ? 'à confirmer' : 'présent'
    }
    participantEvt.type = form.participation
    participantEvt.guestsNumber = form.guestsNumber || 0
    participantEvt.updatedAt = dayjs().toDate()

    event.participants = event.participants.map((p: IParticipant) => {
      if (p.userId === user.id) return participantEvt
      return p
    })
  }
  const participant = event.participants.find((p: IParticipant) => p.userId === user.id)

  event.save()

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

    const confirmParticipantsNum = event.participants.filter((p: IParticipant) => p.status === 'présent').length
    const msg = `---\n**${capitalizeFirstLetter(user.name)}** vient de **${
      newStatus[participant.status]
    }** sa participation à l'événement **${'`'}${event.title}${'`'}** du ${dayjs(event.start).format('LLLL')}.
Il y a maintenant **${'`'}${confirmParticipantsNum}${'`'} participant.e.${
      confirmParticipantsNum > 1 ? 's' : ''
    } confirmé.e.${confirmParticipantsNum > 1 ? 's' : ''}** pour cet événement.\n---`

    publishToDiscord('logs', msg)
  }

  if (participant.type.match(/coach|orga/)) {
    trigger('public', TriggerTypes.EVENT, {
      value: {
        event: {
          ...event.toJSON(),
          participants: publicParticipants(event, user),
        },
      },
    })
  }

  return res.status(200).json({
    event: {
      ...event.toJSON(),
      participants: publicParticipants(event, user),
    },
    participant,
  })
}
