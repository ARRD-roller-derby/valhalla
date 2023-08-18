import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { REST } from '@discordjs/rest'
import { IUserSkill, Skill, TRole, User } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { DISCORD_GUILD_ID, DISCORD_TOKEN, ROLES, checkRoles } from '@/utils'
process.env.TZ = 'Europe/Paris'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'
import { ObjectId } from 'mongodb'
import { Routes } from 'discord-api-types/v10'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

export default async function skill_members(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const id = req.query.id as string
  const canSee = checkRoles([ROLES.coach], user)
  if (!canSee) return res.status(403).send('non autorisé')

  await MongoDb()
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

  const skill = await Skill.findById(new ObjectId(id))
  if (!skill) return res.status(404).send('skill non trouvé')

  const query = new URLSearchParams()
  query.append('limit', '1000')

  const membersRes: any = await rest.get(Routes.guildMembers(DISCORD_GUILD_ID), { query })

  const guildRoles = (await rest.get(Routes.guildRoles(DISCORD_GUILD_ID))) as TRole[]
  const memberRole = guildRoles.find((role) => role.name.toLowerCase() === 'membre')

  return res.status(200).json({
    members: membersRes
      .filter((member: any) => member.roles.includes(memberRole?.id))
      .map((member: any) => {
        const skillUser = skill?.users || []
        const userInSkill = skillUser.find((u: IUserSkill) => u.providerAccountId === member.user.id)
        return {
          username: member?.nick || member.user.username,
          avatar: member.user.avatar
            ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=256`
            : '/static/images/valhalla.png',
          providerAccountId: member.user.id,
          learned: userInSkill?.learned || null,
          master: userInSkill?.master || null,
          notAcquired: userInSkill?.notAcquired || null,
        }
      })
      .sort((a: any, b: any) => a.username.localeCompare(b.username)),
  })
}
