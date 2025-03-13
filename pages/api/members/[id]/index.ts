// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { Badge, TRole, User } from '@/models'

// Bibliothèque interne
import { DISCORD_GUILD_ID, DISCORD_TOKEN, DOLAPIKEY, DOL_URL, hexToTailwind } from '@/utils'
import { dolibarrMemberParser } from '../../../../utils/dolibarr-member-parser'
import { authMiddleWare } from '@/utils/auth-middleware'
import { UserBadge } from '@/models/user_badge.model'
import { ObjectId } from 'mongodb'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

async function member(req: NextApiRequest, res: NextApiResponse) {
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

  const params = new URLSearchParams({
    DOLAPIKEY: DOLAPIKEY,
    limit: '1',
    sqlfilters: `(t.note_private:like:%${providerAccountId}%)`,
  })

  const dolibarrRes = await fetch(`${DOL_URL}members?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const dolibarrData = await dolibarrRes.json()

  const dolibarrInfos = dolibarrMemberParser(dolibarrData, user, providerAccountId)

  const userBagdes = await UserBadge.find({ providerAccountId }, 'badgeId').populate('badgeId')

  const badges = await Badge.find({ _id: { $in: userBagdes.map((b) => b.badgeId) } })

  return res.status(200).json({
    member: {
      ...user.toJSON(),
      ...providerMember.user,
      ...dolibarrInfos,
      roles,
      providerAccountId,
      username: providerMember?.nick || providerMember.user.username,
      avatar: providerMember.user.avatar
        ? `https://cdn.discordapp.com/avatars/${providerMember.user.id}/${providerMember.user.avatar}.png?size=256`
        : '/static/images/valhalla.png',
    },
    badges,
  })
}

export default (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, member)
