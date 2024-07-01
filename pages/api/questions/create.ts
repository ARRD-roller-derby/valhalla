import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
import { Answer, Question } from '@/models'
import { checkRoles } from '@/utils'
import validator from 'validator'
process.env.TZ = 'Europe/Paris'

export default async function questionCreate(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const isCanView = checkRoles(['bureau', 'dev'], user)
  if (!isCanView) return res.status(403).send('non autorisé')

  await MongoDb()
  const form = JSON.parse(req.body || '{}')

  if (form.answers.length < 2 || form.answers.filter((a: Answer) => a.type === 'good').length === 0) {
    return res.status(400).json({ error: 'Il faut au moins une bonne réponse et une mauvaise réponse' })
  }

  const questions = await Question.create({
    question: validator.escape(form.question),
    answers: form.answers.map((answer: Answer) => ({
      answer: validator.escape(answer.answer),
      type: answer.type,
    })),
    img: form.img,
    status: validator.escape(form.status),
  })
  return res.status(200).json(questions)
}
