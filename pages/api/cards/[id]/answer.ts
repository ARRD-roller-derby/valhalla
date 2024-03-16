import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import { Answer, Card, FrequencyEnum } from '@/models/card.model'
import { bank } from '@/services'

export default async function cardAnswer(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')

  const cardId = req.query.id as string
  const body = JSON.parse(req.body)
  if (!cardId) return res.status(404).send('Card not found')

  const answer = body.answer

  if (!answer) return res.status(400).send('Answer not found')

  await MongoDb()
  const card = await Card.findById(cardId)

  const findAnswer = card?.answers.find((a: Answer) => a.answer === answer)
  if (!findAnswer) return res.status(404).send('Answer not found')

  if (!card.flash) {
    card.flash = {
      lastRevision: new Date(),
      frequency: 'daily',
    }
  } else {
    card.flash.lastRevision = new Date()
  }

  const frequencyIdx = FrequencyEnum.indexOf(card.flash.frequency)
  if (findAnswer.type === 'good') {
    if (frequencyIdx < FrequencyEnum.length - 1) {
      card.flash.frequency = FrequencyEnum[frequencyIdx + 1]
    }
    await bank(session.user.id, 5 * frequencyIdx, 1, 'révision de carte')
  } else if (frequencyIdx > 0) {
    card.flash.frequency = FrequencyEnum[frequencyIdx - 1]
  }

  await card.save()

  return res.status(200).json(card)
}
