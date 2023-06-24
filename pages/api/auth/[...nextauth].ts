import clientPromise from '@/db/mongo.auth.connect'
import { Account } from '@/models/account.model'
import {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_GUILD_ID,
  DISCORD_TOKEN,
} from '@/utils/constants'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { MongoDb } from '@/db/db'
import { REST } from '@discordjs/rest'
import { User } from '@/models/user.model'
import { Routes } from 'discord-api-types/v10'

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  debug: true,
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
      await MongoDb()
      const user = await User.findById(session.user.id)

      if (!user?.wallet) {
        user.wallet = 500
        await user.save()
      }

      if (!user.providerAccountId) {
        const account = await Account.findOne({ userId: session.user.id })
        if (account) {
          user.providerAccountId = account.providerAccountId
          await user.save()
        }
      }

      console.log('user', user)

      if (!user) return session

      const guildRoles: any = await rest.get(
        Routes.guildRoles(DISCORD_GUILD_ID)
      )
      const member: any = await rest.get(
        Routes.guildMember(DISCORD_GUILD_ID, user.providerAccountId)
      )
      const roles = guildRoles
        .filter((role: { id: string }) => member.roles.includes(role.id))
        .map((role: any) => ({
          id: role.id,
          name: role.name,
          color: role.color,
        }))
      session.user = {
        ...session.user,
        roles,
        nickname: member.nick,
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
