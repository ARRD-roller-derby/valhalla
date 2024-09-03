import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
process.env.TZ = 'Europe/Paris'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'
import { User } from '@/models'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { checkRoles, ROLES } from '@/utils'
import { UserBadge } from '@/models/user_badge.model'
import { trigger } from '@/services'
import { TriggerTypes } from '@/entities'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

export default async function badges(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user: userSession } = session
  if (!userSession) return res.status(403).send('non autorisé')

  const canUpdate = checkRoles([ROLES.dev, ROLES.coach], userSession)
  if (!canUpdate) return res.status(403).send('non autorisé')

  await MongoDb()

  const { badgeId } = req.query
  const providerAccountId = req.query.userId || userSession.providerAccountId
  const userBadgeExist = await UserBadge.findOne({ providerAccountId, badgeId })

  const user = await User.findOne({ providerAccountId })

  if (userBadgeExist) {
    await UserBadge.deleteOne({ providerAccountId, badgeId })
  } else {
    await UserBadge.create({ providerAccountId, badgeId, unLockDate: dayjs().toDate() })
  }

  const badges = await UserBadge.find({ providerAccountId })
  const count = badges.length

  await trigger(user.id, TriggerTypes.BADGE_COUNT, { value: { count } })

  return res.status(200).json({ count })
}
