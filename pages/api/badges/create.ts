import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { checkRoles } from '@/utils/check-roles'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { ROLES } from '@/utils'
import { Badge, IBadgeSchema } from '@/models'
process.env.TZ = 'Europe/Paris'

export default async function badge_create(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  const isCanCreate = checkRoles([ROLES.coach, ROLES.dev], user)
  if (!isCanCreate) return res.status(403).send('non autorisé')
  const form: IBadgeSchema = JSON.parse(req.body || '{}')

  await MongoDb()

  const { description, name, isProgressive, level, type, tags } = form

  const requiredFields = ['name', 'description', 'type', 'level'] as Array<keyof IBadgeSchema>

  requiredFields.forEach((key) => {
    if (!form[key]) return res.status(400).json({ message: `Le champ ${key} est obligatoire` })
  })

  const isExist = await Badge.findOne({ name, level })
  if (isExist) return res.status(400).json({ message: 'Ce badge existe déjà pour ce niveau' })

  const badge = await Badge.create({
    name,
    description,
    isProgressive,
    level,
    type,
    tags,
    medias: [],
    date: new Date(),
  })

  return res.status(200).json({ badge })
}
