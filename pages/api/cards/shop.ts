import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import { Card } from '@/models/card.model'
import { ObjectId } from 'mongodb'

export default async function shop(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')

  await MongoDb()
  const cards = await Card.find({
    //On ne peut pas acheter ses propres cartes
    $and: [{ owner: { $ne: new ObjectId(session.user.id) } }, { cost: { $gt: 0 } }],
  }).sort({
    type: -1,
    'player.name': 1,
    question: 1,
  })
  return res.status(200).json(cards)
}
