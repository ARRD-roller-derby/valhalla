import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import { Badge } from '@/models'
import { UserBadge } from '@/models/user_badge.model'

export default async function badges(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  await MongoDb()

  const badges_ = await Badge.find()
  const _userBadge = await UserBadge.find({
    providerAccountId: req?.query?.userId || session.user.providerAccountId,
  })

  const userBadge = _userBadge.map((badge) => badge.badgeId)

  const badges = badges_.map((badge) => {
    if (userBadge?.includes(badge._id.toString())) {
      return {
        ...badge.toObject(),
        win: true,
      }
    }
    return {
      ...badge.toObject(),
      win: false,
    }
  })
  return res.status(200).json({ badges })
}
