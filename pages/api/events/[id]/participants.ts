import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { Event } from '@/models'
import { getDiscordMember } from '@/services/get-discord-member'
import { authMiddleWare } from '@/utils/auth-middleware'
process.env.TZ = 'Europe/Paris'

async function event_participants(req: NextApiRequest, res: NextApiResponse, user: any) {
  await MongoDb()

  const event = await Event.findOne({ _id: req.query.id })
  const { members } = await getDiscordMember()

  if (!event) return res.status(404).send('Événement non trouvé')
  return res.status(200).json({
    participants: event.participants.map((par: any) => {
      const m = members.find((member) => member.id === par.userId)
      return {
        ...par._doc,
        ...m,
        name: m?.global_name || m?.username || m?.name,
      }
    }),
  })
}

export default (request: NextApiRequest, response: NextApiResponse) =>
  authMiddleWare(request, response, event_participants)
