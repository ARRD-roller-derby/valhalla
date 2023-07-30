import clientPromise from '@/db/mongo.auth.connect'
import { Account } from '@/models/account.model'
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_GUILD_ID, DISCORD_TOKEN } from '@/utils/constants'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { MongoDb } from '@/db/db'
import { REST } from '@discordjs/rest'
import { TRole, User } from '@/models/user.model'
import { Routes } from 'discord-api-types/v10'

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    DiscordProvider({
      clientId: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session(session: any) {
      const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)
      const guildRoles = (await rest.get(Routes.guildRoles(DISCORD_GUILD_ID))) as TRole[]

      await MongoDb()
      const user = await User.findById(session.user.id)

      if (!user?.wallet) user.wallet = 500

      if (!user.providerAccountId) {
        const account = await Account.findOne({ userId: session.user.id })
        if (account) user.providerAccountId = account.providerAccountId
      }
      const member: any = await rest.get(Routes.guildMember(DISCORD_GUILD_ID, user.providerAccountId))

      if (!user) return session

      const roles = guildRoles
        .filter((role) => member.roles.includes(role.id))
        .map((role) => ({
          id: role.id,
          name: role.name,
          color: role.color,
        }))

      user.roles = roles.filter((role) => roles.find((r) => r.id === role.id))

      await user.save()
      session.user = {
        ...session.user,
        roles: user.roles,
        nickname: member.nick,
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
