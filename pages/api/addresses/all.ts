import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { checkRoles } from '@/utils/check-roles'
import { Address } from '@/models'
import { authMiddleWare } from '@/utils/auth-middleware'

async function address_all(req: NextApiRequest, res: NextApiResponse, user: any) {
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

export default (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, address_all)
