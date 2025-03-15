import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { Badge, Event, User } from '@/models'
import { authMiddleWare } from '@/utils/auth-middleware'
import { UserBadge } from '@/models/user_badge.model'
import { DISCORD_TOKEN } from '@/utils'
import { REST } from '@discordjs/rest'
import { getDiscordMember } from '@/services/get-discord-member'
import { Routes } from 'discord-api-types/v10'
process.env.TZ = 'Europe/Paris'

async function badges_by_event(req: NextApiRequest, res: NextApiResponse) {
  await MongoDb()
  const event = await Event.findOne({ _id: req.query.event_id })
  if (!event) return res.status(404).send('Événement non trouvé')

  const users = await User.find(
    { _id: { $in: event.participants.map((p: any) => p.userId) } },
    'providerAccountId name nickname'
  )

  const participantsBadges = await UserBadge.aggregate([
    { $match: { providerAccountId: { $in: users.map((p) => p.providerAccountId) } } },
  ])

  const { members } = await getDiscordMember()
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

  const participants: any = []

  for (const par of event.participants.filter((p: any) => !p.type.match(/absent/))) {
    const m = members.find((member) => member.id === par.userId)
    if (!m) {
      const baseUser: any = await User.findById(par.userId)

      const providerAccountId = baseUser?.providerAccountId || baseUser._doc?.image.split('/')[4]

      if (/^\d+$/.test(providerAccountId)) {
        try {
          const guest: any = await rest.get(Routes.user(providerAccountId))
          participants.push({
            ...guest,
            ...par._doc,
            avatar: baseUser._doc?.image,
            name: guest?.nick || guest?.global_name || guest?.name,
          })
        } catch (e) {
          participants.push({
            ...par._doc,
            name: baseUser.name,
          })
        }
      }
    } else {
      participants.push({
        ...par._doc,
        ...m,
        name: m?.nick || m?.global_name || m?.name,
      })
    }
  }

  const badges = await Badge.find()

  const badgesWithParticipant = badges
    .map((badge) => {
      return {
        _id: badge._id,
        level: badge.level,
        name: badge.name,
        description: badge.description,
        type: badge.type,
        participants: participants
          .map((user: any) => {
            const win = participantsBadges.find(
              (p) => p.badgeId === badge._id.toString() && p.providerAccountId === user.providerAccountId
            )

            return {
              name: user?.name,
              id: user?._id,
              providerAccountId: user?.providerAccountId,
              win: win ? true : false,
            }
          })
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .sort((_a: any, b: any) => (b.win ? -1 : 1)),
      }
    })
    .filter((badges) => badges.participants.filter((p: any) => p.win).length !== event.participants.length)
    .sort((a, b) => a.participants.length - b.participants.length)

  return res.status(200).json({ badges: badgesWithParticipant })
}

const helper = (request: NextApiRequest, response: NextApiResponse) =>
  authMiddleWare(request, response, badges_by_event)

export default helper
