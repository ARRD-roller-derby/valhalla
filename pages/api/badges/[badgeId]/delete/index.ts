import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'

import { Badge } from '@/models'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { checkRoles, ROLES } from '@/utils'
import { UserBadge } from '@/models/user_badge.model'

export default async function badgeDelete(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user: userSession } = session
  if (!userSession) return res.status(403).send('non autorisé')

  const canUpdate = checkRoles([ROLES.dev, ROLES.coach], userSession)
  if (!canUpdate) return res.status(403).send('non autorisé')

  await MongoDb()

  const { badgeId } = req.query

  await Badge.deleteOne({ _id: badgeId })
  await UserBadge.deleteMany({ badgeId })

  return res.status(200).json({ msg: 'Badge supprimé' })
}
