// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

// Bibliothèque interne
import { DISCORD_GUILD_ID, DISCORD_TOKEN } from '@/utils'
import { authOptions } from '../auth/[...nextauth]'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

//Les profiles Discord
export default async function profiles(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

  const roles = await rest.get(Routes.guildRoles(DISCORD_GUILD_ID))

  return res.status(200).json({ roles })
}
