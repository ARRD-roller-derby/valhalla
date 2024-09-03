import { User } from '@/models'
import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'

export async function midgardMiddleWare(request: NextApiRequest, response: NextApiResponse, helper: Function) {
  const { headers } = request
  const provider_id = headers?.['provider_id']

  if (!headers?.['authorization'] || headers['authorization'].replace('Bearer ', '') !== process.env.MIDGARD_TOKEN)
    return response.status(401).json({ error: 'non autorisé' })

  if (!provider_id) return response.status(401).json({ error: 'aucun id utilisateur' })

  await MongoDb()
  const user = await User.findOne({ providerAccountId: provider_id })
  if (!user) return helper(request, response)
  return helper(request, response, user.toJSON())
}

export async function midgardMiddleWarewithoutUser(
  request: NextApiRequest,
  response: NextApiResponse,
  helper: Function
) {
  const { headers } = request

  if (!headers?.['authorization'] || headers['authorization'].replace('Bearer ', '') !== process.env.MIDGARD_TOKEN)
    return response.status(401).json({ error: 'non autorisé' })

  return helper(request, response, true)
}
