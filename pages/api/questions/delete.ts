import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
import { Question } from '@/models'
import { checkRoles } from '@/utils'

import S3 from '@/utils/bucket'

process.env.TZ = 'Europe/Paris'

export default async function questionUpdate(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const isCanView = checkRoles(['sagwa master', 'dev'], user)
  if (!isCanView) return res.status(403).send('non autorisé')

  await MongoDb()
  const { _id } = JSON.parse(req.body)

  const question = await Question.findOne({ _id })

  if (!question) return res.status(404).json({ error: 'Question not found' })

  if (question.img) {
    const s3 = new S3()
    await s3.deleteMedia(question.img)
  }

  await Question.deleteOne({ _id })

  return res.status(200).json({ message: 'ok' })
}
