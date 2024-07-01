import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
import { Question } from '@/models'
import { checkRoles } from '@/utils'

process.env.TZ = 'Europe/Paris'

export default async function questions(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const isCanView = checkRoles(['bureau', 'dev'], user)
  if (!isCanView) return res.status(403).send('non autorisé')

  await MongoDb()
  const questions = await Question.find({}).sort({ status: -1 })
  return res.status(200).json(questions)
}
