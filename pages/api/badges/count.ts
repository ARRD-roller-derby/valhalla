import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import { UserBadge } from '@/models/user_badge.model'

export default async function badges(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  await MongoDb()

  const userBadge = await UserBadge.find({
    providerAccountId: session.user.providerAccountId,
  })

  return res.status(200).json({ count: userBadge.length })
}
