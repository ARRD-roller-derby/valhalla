import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Event, User } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { DISCORD_GUILD_ID, DISCORD_TOKEN } from '@/utils'
import { Routes } from 'discord-api-types/v10'
import { REST } from '@discordjs/rest'
process.env.TZ = 'Europe/Paris'

export default async function event_participants(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  if (!user) return res.status(403).send('non autorisé')

  await MongoDb()

  const event = await Event.findOne({ _id: req.query.id })
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

  const query = new URLSearchParams()
  query.append('limit', '1000')
  const membersRes: any = await rest.get(Routes.guildMembers(DISCORD_GUILD_ID), { query })
  const users = await User.find({}).lean()

  const guildMembers = membersRes.map((member: any) => {
    const user = users.find((user) => user.providerAccountId === member.user.id)

    if (!user) return member.user
    const id = user._id as string
    return {
      ...user,
      id: id.toString(),
      name: member.user.global_name || user.name,
    }
  })

  event.participants = event.participants.map((par: any) => {
    const user = guildMembers.find((user: any) => user.id === par.userId)

    if (!user) return par
    return {
      ...par,
      name: user.name,
    }
  })

  if (!event) return res.status(404).send('Événement non trouvé')
  return res.status(200).json({
    participants: event.participants,
  })
}
