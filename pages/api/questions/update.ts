import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
import { Answer, Question } from '@/models'
import { checkRoles } from '@/utils'
import validator from 'validator'
import formidable from 'formidable'
import fs from 'fs'
import S3 from '@/utils/bucket'
import { ObjectId } from 'mongodb'

process.env.TZ = 'Europe/Paris'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function questionUpdate(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const isCanView = checkRoles(['sagwa master', 'dev'], user)
  if (!isCanView) return res.status(403).send('non autorisé')

  const form = new formidable.IncomingForm()
  const fileContent: {
    file: { content: Buffer; name: string; type: string; size: number; extension: string }
    fields: { question: string; _id: any; answers: string; file: any; status: string; img?: string; delImg?: boolean }
  } = await new Promise((resolve, reject) => {
    form.parse(req, (_err: any, fields: any, files: any) => {
      //@ts-ignore
      if (!files.file) return resolve({ fields })
      const fileContentBuffer = fs.readFileSync(files.file.filepath)
      resolve({
        file: {
          content: fileContentBuffer,
          name: files.file.originalFilename,
          type: files.file.mimetype,
          size: files.file.size,
          extension: files.file.originalFilename.split('.').pop(),
        },
        fields,
      })

      reject()
    })
  })

  const { fields, file } = fileContent
  const { question, answers: _answers, status, _id, img: _img } = fields

  let img = _img

  if (file) {
    const s3 = new S3()
    // @ts-ignore
    img = await s3.sendMedia({
      folder: 'questions',
      body: file.content as any,
      fileName: _id,
      ext: file.extension as string,
      tag: 'question',
    })
  }

  if (fields.delImg) {
    const s3 = new S3()
    const q = await Question.findOne({ _id: new ObjectId(_id) })
    if (q?.img) {
      await s3.deleteMedia(q.img)
      img = ''
    }
  }

  const answers = JSON.parse(_answers || '[]')

  if (answers.length < 2 || answers.filter((a: Answer) => a.type === 'good').length === 0) {
    return res.status(400).json({ error: 'Il faut au moins une bonne réponse et une mauvaise réponse' })
  }

  await MongoDb()

  const questions = await Question.updateOne(
    { _id: new ObjectId(_id) },
    {
      question: validator.escape(question),
      answers: answers.map((answer: Answer) => ({
        answer: validator.escape(answer.answer),
        type: answer.type,
      })),
      img,
      status: validator.escape(status),
    }
  )

  return res.status(200).json(questions)
}
