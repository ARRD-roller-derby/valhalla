import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { Event, User } from '@/models'
import { getDiscordMember } from '@/services/get-discord-member'
import { authMiddleWare } from '@/utils/auth-middleware'
import { DISCORD_TOKEN } from '@/utils'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

process.env.TZ = 'Europe/Paris'

async function event_participants(req: NextApiRequest, res: NextApiResponse, user: any) {
  await MongoDb()

  const event = await Event.findOne({ _id: req.query.id })
  const { members } = await getDiscordMember()

  if (!event) return res.status(404).send('Événement non trouvé')
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

  const participants = []

  for (const par of event.participants) {
    const m = members.find((member) => member.id === par.userId)
    if (!m) {
      const baseUser: any = await User.findById(par.userId)

      const providerAccountId = baseUser?.providerAccountId || baseUser._doc?.image.split('/')[4]

      if (/^\d+$/.test(providerAccountId)) {
        try {
          const guest: any = await rest.get(Routes.user(providerAccountId))
          participants.push({
            ...guest,
            ...par._doc,
            avatar: baseUser._doc?.image,
            name: guest?.nick || guest?.global_name || guest?.name,
          })
        } catch (e) {
          participants.push({
            ...par._doc,
            name: baseUser.name,
          })
        }
      }
    } else {
      participants.push({
        ...par._doc,
        ...m,
        name: m?.nick || m?.global_name || m?.name,
      })
    }
  }

  return res.status(200).json({
    participants,
  })
}

export default (request: NextApiRequest, response: NextApiResponse) =>
  authMiddleWare(request, response, event_participants)
