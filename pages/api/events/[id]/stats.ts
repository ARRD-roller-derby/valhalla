import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { Badge, Event, User } from '@/models'
import { authMiddleWare } from '@/utils/auth-middleware'
import { UserBadge } from '@/models/user_badge.model'
process.env.TZ = 'Europe/Paris'

async function stats_vent(req: NextApiRequest, res: NextApiResponse) {
  await MongoDb()

  const event = await Event.findOne({ _id: req.query.id })
  if (!event) return res.status(404).send('Événement non trouvé')

  const users = await User.find(
    { _id: { $in: event.participants.filter((p: any) => !p.type.match(/absent/)).map((p: any) => p.userId) } },
    'providerAccountId'
  )

  const totalParticipants = users.length

  const participantsBadges = await UserBadge.aggregate([
    { $match: { providerAccountId: { $in: users.map((p: any) => p.providerAccountId) } } },
    { $group: { _id: '$badgeId', count: { $sum: 1 } } },
  ])

  const badges = await Badge.find()

  const unlockedBadges = participantsBadges.map((p: any) => {
    const badge = badges.find((b) => b._id.toString() === p._id)
    if (!badge) return { ...p, level: 'vie-asso', name: 'Badge supprimé' }
    const percentage = (p.count / totalParticipants) * 100
    if (percentage < badge.percentage) return { ...p, level: 'vie-asso', name: 'Badge supprimé' }
    return { ...p, level: badge.level, name: badge.name, percentage }
  })

  const levels = unlockedBadges.reduce((acc: any, curr: any) => {
    if (curr.level === 'vie-asso') return acc
    if (!acc[curr.level]) acc[curr.level] = 0
    acc[curr.level]++
    return acc
  }, {})

  const statsLevels = Object.keys(levels)
    .map((l) => {
      const allBadgesCountForLevel = unlockedBadges.filter((b) => b.level === l)
      const totalBadgesCountForLevel = allBadgesCountForLevel.length
      const completionRates = allBadgesCountForLevel.map((b) => b.percentage)

      return {
        level: l,
        count: levels[l],
        completionRate: completionRates.reduce((a, b) => a + b, 0) / totalBadgesCountForLevel,
      }
    })
    .sort((a, b) => a.completionRate - b.completionRate)

  return res.status(200).json({
    stats: statsLevels,
  })
}

const helper = (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, stats_vent)

export default helper
