// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { TRole, User } from '@/models'

// Bibliothèque interne
import { DISCORD_GUILD_ID, DISCORD_TOKEN, hexToTailwind } from '@/utils'
import { authOptions } from '../../auth/[...nextauth]'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

export default async function member(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')

  const providerAccountId = req.query.id as string

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

  const providerMember: any = await rest.get(Routes.guildMember(DISCORD_GUILD_ID, providerAccountId))
  const guildRoles = (await rest.get(Routes.guildRoles(DISCORD_GUILD_ID))) as TRole[]

  //TODO, ici, c 'est à dolibarr qu'on va faire appel pour récupérer les infos du membre
  const user = await User.findOne({ providerAccountId })
  const roles = guildRoles
    .filter((role) => providerMember.roles.includes(role.id))
    .map((role) => ({
      id: role.id,
      name: role.name,
      color: hexToTailwind(role.color),
    }))

  return res.status(200).json({
    member: {
      ...user,
      ...providerMember.user,
      roles,
      providerAccountId,
      username: providerMember?.nick || providerMember.user.username,
      avatar: providerMember.user.avatar
        ? `https://cdn.discordapp.com/avatars/${providerMember.user.id}/${providerMember.user.avatar}.png?size=256`
        : '/static/images/valhalla.png',
    },
  })
}
