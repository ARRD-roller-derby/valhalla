// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
import { Event } from '@/models'
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
import { IUser } from '@/models'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

async function carpoolCreate(req: NextApiRequest, res: NextApiResponse, user: IUser) {
  const { messageId, address, date, places, eventId } = req.body
  const event = await Event.findOne({ _id: eventId })
  if (!event) return res.status(404).send('Événement non trouvé')

  if (!messageId || !address || !date || !places) return res.status(400).send('Données manquantes')

  // Créer l'objet de covoiturage
  const carpooling = {
    messageId,
    address,
    date,
    places,
    userId: user.providerAccountId,
    name: user.name,
    createdAt: new Date(),
  }

  // Mettre à jour l'événement avec les informations de covoiturage
  await Event.findByIdAndUpdate(eventId, {
    $push: { carpooling: carpooling },
  })

  return res.status(200).json({ success: true, carpooling })
}

const helper = (request: NextApiRequest, response: NextApiResponse) =>
  midgardMiddleWare(request, response, carpoolCreate)

export default helper
