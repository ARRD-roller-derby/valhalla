import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
process.env.TZ = 'Europe/Paris'

import { Badge } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
export default async function badges(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  await MongoDb()

  const badge = await Badge.findById(req.query.badgeId)

  return res.status(200).json({ badge })
}
