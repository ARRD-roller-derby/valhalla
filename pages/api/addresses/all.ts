import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { checkRoles } from '@/utils/check-roles'
import { Address } from '@/models'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function address_all(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  const isCanView = checkRoles(['bureau', 'dev', 'evénements', 'coach'], user)
  if (!isCanView) return res.status(403).send('non autorisé')

  await MongoDb()
  const addresses = await Address.find()
    .sort({
      popularity: -1,
    })
    .limit(100)

  return res.status(200).json(addresses)
}
