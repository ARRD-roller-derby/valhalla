// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

// Bibliothèque interne
import { DISCORD_GUILD_ID, DISCORD_TOKEN, hexToTailwind } from '@/utils'
import { authMiddleWare } from '@/utils/auth-middleware'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

//Les profiles Discord
async function profiles(req: NextApiRequest, res: NextApiResponse) {
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

  const roles: any = await rest.get(Routes.guildRoles(DISCORD_GUILD_ID))

  return res.status(200).json({
    roles: roles.map((role: any) => ({
      ...role,
      color: hexToTailwind(role.color),
    })),
  })
}

export default (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, profiles)
