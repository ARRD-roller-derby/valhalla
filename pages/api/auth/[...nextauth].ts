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
import { ObjectId } from 'mongodb'

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
      const user = await User.findById(new ObjectId(session.user.id))
      if (!user?.wallet) user.wallet = 500

      if (!user.providerAccountId) {
        const account = await Account.findOne({ userId: session.user.id })
        if (account) user.providerAccountId = account.providerAccountId
      }
      const member: any = await rest.get(Routes.guildMember(DISCORD_GUILD_ID, user.providerAccountId))
      if (!user) return session

      if (member.user.global_name && user.name !== member.user.global_name) {
        User.updateOne(
          { _id: user._id },
          {
            name: member.user.global_name,
          }
        )
      }
      const roles = guildRoles
        .filter((role) => member.roles.includes(role.id))
        .map((role) => ({
          id: role.id,
          name: role.name,
          color: role.color,
        }))

      const newRoles = roles.filter((role) => roles.find((r) => r.id === role.id))

      // Vérifier si le document utilisateur a été modifié
      if (user.isModified('wallet')) {
        // Mise à jour des champs modifiés uniquement
        const updateFields = {
          wallet: user.wallet,
          roles: newRoles,
          providerAccountId: user.providerAccountId,
        }

        // Effectuer la mise à jour dans la base de données On utiliser pas user.save(). On utilise User.updateOne() pour éviter de déclencher les hooks

        await User.updateOne({ _id: user._id }, updateFields)
      }

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
