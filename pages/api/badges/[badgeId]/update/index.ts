import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
process.env.TZ = 'Europe/Paris'

import { Badge } from '@/models'
import { authOptions } from '../../../auth/[...nextauth]'
import { checkRoles, ROLES } from '@/utils'
export default async function badges(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  const canUpdate = checkRoles([ROLES.coach, ROLES.dev], user)
  if (!canUpdate) return res.status(403).send('non autorisé')
  await MongoDb()

  const form = JSON.parse(req.body || '{}')

  delete form._id

  const badge = await Badge.updateOne({ _id: req.query.badgeId }, form)
  return res.status(200).json({ badge })
}
