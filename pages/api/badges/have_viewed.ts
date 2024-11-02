import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import { UserBadge } from '@/models/user_badge.model'

export default async function have_viewed_badges(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  await MongoDb()

  await UserBadge.updateMany(
    {
      providerAccountId: session.user.providerAccountId,
      hasViewed: false,
    },
    {
      hasViewed: true,
    }
  )

  return res.status(200).json({ success: true })
}
