import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'
import dayjs, { ManipulateType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

import { Answer, Card } from '@/models/card.model'

function getFrequency(frequency?: string): {
  frequency: number
  unit: ManipulateType
} {
  switch (frequency) {
    case 'daily':
      return { frequency: 1, unit: 'day' }
    case '3days':
      return { frequency: 3, unit: 'day' }
    case 'weekly':
      return { frequency: 1, unit: 'week' }
    case 'monthly':
      return { frequency: 1, unit: 'month' }
    case 'trimester':
      return { frequency: 3, unit: 'month' }
    case 'semester':
      return { frequency: 6, unit: 'month' }
    case 'yearly':
      return { frequency: 1, unit: 'year' }
    default:
      return { frequency: 1, unit: 'day' }
  }
}
export default async function cardsFlash(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  await MongoDb()

  const cards = await Card.find({ $and: [{ owner: user.id }, { type: 'flashcard' }, { cost: 0 }] })

  // Trier les card pour avoir que celle à reviser.
  const now = dayjs()

  const flashCards = cards.filter((card) => {
    //Si pas de flash, ajouter
    const lastRevision = card?.flash?.lastRevision ? dayjs(card.flash.lastRevision) : dayjs().subtract(1, 'month')
    const frequency = getFrequency(card.flash?.frequency)
    const nextRevision = lastRevision.add(frequency.frequency, frequency.unit)
    return dayjs(nextRevision).isBefore(now)
  })

  if (flashCards.length === 0)
    return res.status(200).json({
      flashCard: null,
      count: 0,
    })

  const flashCard = flashCards[Math.floor(Math.random() * flashCards.length)]
  flashCard.answers.forEach((answer: Answer) => {
    answer.type = 'bad'
  })

  return res.status(200).json({
    flashCard,
    count: flashCards.length,
  })
}
