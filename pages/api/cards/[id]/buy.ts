import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import { Card } from '@/models/card.model'
import { ObjectId } from 'mongodb'
import { bank } from '@/services'
import { PURCHASE_TYPES } from '@/utils'

export default async function cardBuy(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')

  const cardId = req.query.id as string
  if (!cardId) return res.status(404).send("La carte a été vendue ou n'existe pas")

  await MongoDb()
  const card = await Card.findById(cardId)

  const cost = card.cost
  if (cost > session.user.wallet) return res.status(400).send("Pas assez d'argent")

  const oldOwnerId = card.owner
  const newOwner = new ObjectId(session.user.id)

  card.owner = newOwner
  card.cost = 0
  await card.save()
  //On paye le vendeur
  await bank(oldOwnerId.toString(), cost, 1, PURCHASE_TYPES.sellCard)
  //on Achète la carte
  await bank(session.user.id, -cost, 1, PURCHASE_TYPES.buyCard)

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
