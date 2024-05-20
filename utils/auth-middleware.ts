import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { User } from '@/models'
import { MongoDb } from '@/db'

export async function authMiddleWare(request: NextApiRequest, response: NextApiResponse, helper: Function) {
  const session = await getServerSession(request, response, authOptions)

  if (session) return helper(request, response, session.user)
  const { headers } = request
  const provider_id = headers?.['provider_id']

  if (!headers?.['authorization'] || headers['authorization'].replace('Bearer ', '') !== process.env.MIDGARD_TOKEN)
    return response.status(401).json({ error: 'non autorisé' })

  if (!provider_id) return response.status(401).json({ error: 'aucun id utilisateur' })
  await MongoDb()
  const user = await User.findOne({ providerAccountId: provider_id })
  if (user) {
    return helper(request, response, {
      ...user.toJSON(),
      id: user._id.toString(),
    })
  }
  return response.status(403).send('non autorisé')
}
