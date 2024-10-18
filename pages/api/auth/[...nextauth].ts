import clientPromise from '@/db/mongo.auth.connect'
import { Account } from '@/models/account.model'
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_GUILD_ID, DISCORD_TOKEN, ROLES } from '@/utils/constants'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { MongoDb } from '@/db/db'
import { REST } from '@discordjs/rest'
import { TRole, User } from '@/models/user.model'
import { Routes } from 'discord-api-types/v10'
import { ObjectId } from 'mongodb'

function checkChangedRoles(newRole: TRole[], userRole: TRole[]) {
  if (newRole.length !== userRole.length) {
    return true // Longueurs différentes, donc pas les mêmes rôles
  }

  return !newRole.every((role) => userRole.some((r) => r.id === role.id))
}

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

      if (!user.providerAccountId) {
        const account = await Account.findOne({ userId: session.user.id })
        if (account) user.providerAccountId = account.providerAccountId
      }

      let member: any = undefined
      try {
        member = await rest.get(Routes.guildMember(DISCORD_GUILD_ID, user.providerAccountId))
      } catch (e) {
        return {
          ...session,
          user: {
            ...session.user,
            roles: [
              {
                id: '0',
                name: ROLES.everyone,
                color: 0x000000,
              },
            ],
          },
        }
      }
      if (!user || !member) return session

      if (member?.user?.global_name && user.name !== member.user.global_name) {
        User.updateOne(
          { _id: user._id },
          {
            name: member.nick || member.user.global_name,
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

      const haveRoleChanged = checkChangedRoles(roles, user.roles)

      if (haveRoleChanged) {
        user.roles = roles
        await user.save()
      }

      // Vérifier si le document utilisateur a été modifié
      if (user.isModified('wallet')) {
        // Mise à jour des champs modifiés uniquement
        const updateFields = {
          providerAccountId: user.providerAccountId,
        }

        // Effectuer la mise à jour dans la base de données On utiliser pas user.save(). On utilise User.updateOne() pour éviter de déclencher les hooks
        await User.updateOne({ _id: user._id }, updateFields)
      }

      session.user = {
        ...session.user,
        roles,
        nickname: member.nick,
        image: member.user.avatar
          ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
          : null,
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
