import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import { Card } from '@/models/card.model'
import { ObjectId } from 'mongodb'
import { trigger } from '@/services'
import { TriggerTypes } from '@/entities'

function getCost(originalCost: unknown): number {
  if (typeof originalCost === 'number') return originalCost
  if (typeof originalCost === 'string') return parseInt(originalCost)
  return 0
}

export default async function cardSell(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const cardId = req.query.id as string
  if (!cardId) return res.status(404).send('Card not found')

  const { cost: originalCost } = JSON.parse(req.body)

  const cost = getCost(originalCost)

  await MongoDb()

  await Card.updateOne({ _id: new ObjectId(cardId) }, { cost })
  const cards = await Card.find({ owner: user.id }).sort({ type: -1, 'player.name': 1, question: 1 })
  await trigger('public', TriggerTypes.SHOP, {})
  return res.status(200).json(cards)
}
