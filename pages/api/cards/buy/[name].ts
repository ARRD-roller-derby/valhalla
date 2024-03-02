import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import { Card } from '@/models/card.model'
import { boosters } from '@/utils/boosters'
import { bank } from '@/services'

const percentForRare = 0.1
const percentForEpic = 0.05
const percentForLegendary = 0.01

export default async function eventsNext(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const booster = boosters.find((b) => b.key === req.query.name)

  if (!booster) return res.status(404).send('Booster not found')
  const newWallet = user.wallet - booster.cost

  if (newWallet < 0) return res.status(400).send('Solde insuffisant')

  await MongoDb()

  //On stocke les cartes du booster
  const boosterCards = {
    common: booster.common,
    rare: booster.rare,
    epic: booster.epic,
    legendary: booster.legendary,
  }

  //On ajuste les cartes en fonction de la rareté du booster
  if (booster.key === 'classic') {
    const haveRare = Math.random() < percentForRare

    if (haveRare) {
      boosterCards.rare = 1
      boosterCards.common -= 1
    }
  }

  if (booster.key === 'rare') {
    const haveEpic = Math.random() < percentForEpic

    if (haveEpic) {
      boosterCards.rare -= 1
      boosterCards.epic = 1
    }
  }

  if (booster.key === 'epic') {
    const haveLegendary = Math.random() < percentForLegendary

    if (haveLegendary) {
      boosterCards.epic -= 1
      boosterCards.legendary = 1
    }
  }

  //On calcule le nombre total de cartes
  const total = Object.values(boosterCards).reduce((acc, curr) => acc + curr, 0)

  //On récupère les cartes disponibles, c'est-à-dire celles qui n'ont pas de propriétaire
  const cards = await Card.find({ owner: null })

  const result: Card[] = []

  //On récupère les cartes en fonction de leur rareté, on les mélange et on en prend un certain nombre
  for (const type in boosterCards) {
    if (boosterCards[type as keyof typeof boosterCards] > 0) {
      const filteredCards = cards.filter((card) => card.rarity === type)
      const randomCards = filteredCards
        .sort(() => Math.random() - Math.random())
        .slice(0, boosterCards[type as keyof typeof boosterCards])

      result.push(...randomCards)
    }
  }

  //Si on a pas le nombre total de cartes, on complète avec des cartes communes
  if (result.length < total) {
    const filteredCards = cards.filter(
      (card) => card.rarity === 'common' && result.every((r) => r._id.toString() !== card._id.toString())
    )
    const randomCards = filteredCards.sort(() => Math.random() - Math.random()).slice(0, total - result.length)

    result.push(...randomCards)
  }

  //On ajoute les cartes au joueur
  await Card.insertMany(result.map((card) => ({ ...card, owner: user.id })))

  //On retire le coût du booster
  await bank(user.id, -booster.cost, 1, booster.key)

  return res.status(200).json(result)
}
