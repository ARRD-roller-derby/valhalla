import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import { Badge } from '@/models/badges.model'
import { UserBadge } from '@/models/user_badge.model'
import { getDiscordMember } from '@/services/get-discord-member'

export default async function hallOfFame(req: NextApiRequest, res: NextApiResponse, midgard: boolean = false) {
  if (!midgard) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(403).send('non autorisé')
  }

  await MongoDb()

  const { members } = await getDiscordMember()

  // Récupérer tous les badges et les badges des utilisateurs
  const badges = await Badge.find().select('_id level name')
  const userBadges = await UserBadge.find()

  const winnedBadges = userBadges.map((userBadge) => {
    const badge = badges.find((badge) => badge._id.toString() === userBadge.badgeId.toString())
    return {
      badgeId: userBadge.badgeId,
      level: badge.level,
      providerAccountId: userBadge.providerAccountId,
      unLockDate: userBadge.unLockDate,
    }
  })

  const userBadgesGrouped = winnedBadges.reduce((acc, userBadge) => {
    if (!acc[userBadge.providerAccountId]) {
      acc[userBadge.providerAccountId] = {
        or: 0,
        argent: 0,
        bronze: 0,
        total: 0,
      }
    }
    acc[userBadge.providerAccountId][userBadge.level]++
    acc[userBadge.providerAccountId].total++
    acc.unLockDate = userBadge.unLockDate
    return acc
  }, {} as any)

  const dailyBadges = winnedBadges
    .filter((userBadge) => {
      return userBadge.unLockDate > new Date(new Date().setHours(0, 0, 0, 0))
    })
    .reduce(
      (acc, userBadge) => {
        const index = acc.findIndex((user) => user.providerAccountId === userBadge.providerAccountId)

        const badge = badges.find((badge) => badge._id.toString() === userBadge.badgeId.toString())
        if (index !== -1) {
          acc[index].badges.push({
            level: badge.level,
            name: badge.name,
          })
          return acc
        } else {
          acc.push({
            providerAccountId: userBadge.providerAccountId,
            badges: [
              {
                level: badge.level,
                name: badge.name,
              },
            ],
          })
        }
        return acc
      },
      [] as { providerAccountId: string; badges: { level: string; name: string }[] }[]
    )

  const userBadgesGroupedArray = Object.entries(userBadgesGrouped)
    .map(([providerAccountId, badges]) => {
      const user = members.find((member) => member.providerAccountId === providerAccountId)
      if (!user) return null
      return { name: user.nick || user.name, avatar: user.avatar, badges }
    })
    .filter(Boolean) as {
    name: string
    avatar: string
    badges: { or: number; argent: number; bronze: number; total: number }
  }[]

  const podium = userBadgesGroupedArray

    .slice(0, 3)
    .map((user) => ({ name: user.name, avatar: user.avatar, total: user.badges.total }))
  const podiumOr = userBadgesGroupedArray
    .sort((a, b) => b.badges.or - a.badges.or)
    .slice(0, 3)
    .map((user) => ({ name: user.name, avatar: user.avatar, total: user.badges.or }))
  const podiumArgent = userBadgesGroupedArray
    .sort((a, b) => b.badges.argent - a.badges.argent)
    .slice(0, 3)
    .map((user) => ({ name: user.name, avatar: user.avatar, total: user.badges.argent }))
  const podiumBronze = userBadgesGroupedArray
    .sort((a, b) => b.badges.bronze - a.badges.bronze)
    .slice(0, 3)
    .map((user) => ({ name: user.name, avatar: user.avatar, total: user.badges.bronze }))

  return res.status(200).json({
    classement: userBadgesGroupedArray.sort((a, b) => b.badges.total - a.badges.total),
    dailyBadges,
    hallOfFame: [
      {
        title: 'Légendaire',
        key: 'all',
        podium,
      },
      {
        title: 'Podium Or',
        key: 'or',
        podium: podiumOr,
      },
      {
        title: 'Podium Argent',
        key: 'argent',
        podium: podiumArgent,
      },
      {
        title: 'Podium Bronze',
        key: 'bronze',
        podium: podiumBronze,
      },
    ],
  })
}
