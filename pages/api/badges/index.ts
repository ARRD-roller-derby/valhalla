import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
process.env.TZ = 'Europe/Paris'

import { Badge } from '@/models'
import { UserBadge } from '@/models/user_badge.model'
import { authMiddleWare } from '@/utils/auth-middleware'

export async function badges(req: NextApiRequest, res: NextApiResponse, user: any) {
  await MongoDb()

  const badges_ = await Badge.find()
  const _userBadge = await UserBadge.find({
    providerAccountId: req?.query?.userId || user.providerAccountId,
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

export default (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, badges)
