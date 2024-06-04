// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'

// Bibliothèque interne
import { DOLAPIKEY, DOL_URL, dolibarrMemberParser, hexToTailwind } from '@/utils'
import { getDiscordMember } from '@/services/get-discord-member'
import { authMiddleWare } from '@/utils/auth-middleware'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

async function members(_req: NextApiRequest, res: NextApiResponse, user: any) {
  const { members: discordMembers, guildRoles } = await getDiscordMember()

  const params = new URLSearchParams({
    DOLAPIKEY: DOLAPIKEY,
    limit: '1000',
  })

  const dolibarrRes = await fetch(`${DOL_URL}members?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const dolibarrData = await dolibarrRes.json()

  const members = discordMembers
    .filter((member) => !member.bot)
    .map((member: any) => {
      const roles = guildRoles
        .filter((role) => member?.roles?.includes(role.id))
        .map((role) => ({
          id: role.id,
          name: role.name,
          color: hexToTailwind(role.color),
        }))

      const dolibarrMember = dolibarrData.find((dolibarrMember: any) =>
        dolibarrMember?.note_private ? dolibarrMember.note_private.includes(member.providerAccountId) : false
      )

      const dolibarrInfos = dolibarrMember ? dolibarrMemberParser([dolibarrMember], user, member.providerAccountId) : {}
      return {
        ...member.user,
        ...dolibarrInfos,
        roles,
        providerAccountId: member.providerAccountId,
        username: member?.nick || member?.user?.global_name || member.user.username,
        avatar: member.user.avatar
          ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=256`
          : '/static/images/valhalla.png',
      }
    })
    .filter((member: any) => member.roles.some((role: any) => role.name.toLowerCase() === 'membre'))

    .sort((a: any, b: any) => a.username.localeCompare(b.username))
    .sort((a: any, b: any) => {
      const aHasBureau = a.roles.some((role: any) => role.name.toLowerCase() === 'bureau')
      const bHasBureau = b.roles.some((role: any) => role.name.toLowerCase() === 'bureau')
      if (aHasBureau && !bHasBureau) return -1
      else if (!aHasBureau && bHasBureau) return 1
      return 0
    })

  return res.status(200).json({ members })
}

export default (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, members)
