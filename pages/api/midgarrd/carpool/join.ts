// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
import { Event, ICarpooling } from '@/models'
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

async function carpoolJoin(req: NextApiRequest, res: NextApiResponse, user: IUser) {
  const { messageId, eventId } = req.body
  const event = await Event.findOne({ _id: eventId })
  if (!event) return res.status(404).send('Événement non trouvé')

  if (!messageId) return res.status(400).send('ID du message manquant')

  // Trouver le covoiturage spécifique
  const carpool = event.carpooling?.find((c: ICarpooling) => c.messageId === messageId)
  if (!carpool) return res.status(404).send('Covoiturage non trouvé')

  // Vérifier si l'utilisateur est déjà dans le covoiturage
  const isAlreadyJoined = carpool.participants?.some((p: { userId: string }) => p.userId === user.providerAccountId)

  if (isAlreadyJoined) return res.status(400).send('Vous êtes déjà inscrit à ce covoiturage')

  // Vérifier s'il reste des places
  const currentParticipants = carpool.participants?.length || 0
  if (currentParticipants >= carpool.places) {
    return res.status(400).send('Plus de places disponibles')
  }

  // Ajouter l'utilisateur au covoiturage
  const result = await Event.findOneAndUpdate(
    {
      _id: eventId,
      'carpooling.messageId': messageId,
    },
    {
      $push: {
        'carpooling.$.participants': {
          userId: user.providerAccountId,
          name: user.name,
          status: 'confirmed',
          joinedAt: new Date(),
        },
      },
    },
    { new: true }
  )

  if (!result) return res.status(404).send("Erreur lors de l'inscription")

  return res.status(200).json({ success: true })
}

const helper = (request: NextApiRequest, response: NextApiResponse) => midgardMiddleWare(request, response, carpoolJoin)

export default helper
