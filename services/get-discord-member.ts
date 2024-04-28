import { TRole } from '@/models'
import { DISCORD_GUILD_ID, DISCORD_TOKEN } from '@/utils'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

import { User } from '../models/user.model'
import { MongoDb } from '@/db'

export async function getDiscordMember() {
  const query = new URLSearchParams()
  query.append('limit', '1000')

  await MongoDb()
  const users = await User.find()

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)
  const membersRes = await rest.get(Routes.guildMembers(DISCORD_GUILD_ID), { query })
  const guildRoles = (await rest.get(Routes.guildRoles(DISCORD_GUILD_ID))) as TRole[]
  const members = membersRes as any[]

  return {
    members: members.map((member) => {
      const user = users.find((user) => user.providerAccountId === member?.user?.id)
      return {
        ...user?._doc,
        ...member.user,
        id: user?._doc?._id.toString(),
        avatar: member.user.avatar
          ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=256`
          : '/static/images/valhalla.png',
      }
    }),
    guildRoles,
  }
}
