// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { TRole } from '@/models'

// Bibliothèque interne
import { DISCORD_GUILD_ID, DISCORD_TOKEN, hexToTailwind } from '@/utils'
import { authOptions } from '../auth/[...nextauth]'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

export default async function eventsNext(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

  const query = new URLSearchParams()
  query.append('limit', '1000')

  const membersRes: any = await rest.get(Routes.guildMembers(DISCORD_GUILD_ID), { query })
  const guildRoles = (await rest.get(Routes.guildRoles(DISCORD_GUILD_ID))) as TRole[]

  const members = membersRes
    .map((member: any) => {
      const roles = guildRoles
        .filter((role) => member.roles.includes(role.id))
        .map((role) => ({
          id: role.id,
          name: role.name,
          color: hexToTailwind(role.color),
        }))
      return {
        ...member.user,
        roles,
        username: member?.nick || member.user.username,
        avatar: member.user.avatar
          ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=256`
          : '/static/images/valhalla.png',
      }
    })
    .filter((member: any) => member.roles.some((role: any) => role.name.toLowerCase() === 'membre'))
    .sort((a: any, b: any) => a.username.localeCompare(b.username))

  return res.status(200).json({ members })
}