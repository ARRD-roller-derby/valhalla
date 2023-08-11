import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { checkRoles } from '@/utils/check-roles'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Skill, Tag } from '@/models'
import { ROLES } from '@/utils'
import { ISkillCreate } from '@/entities'

process.env.TZ = 'Europe/Paris'

export default async function skill_create(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  const isCanCreate = checkRoles([ROLES.coach], user)
  if (!isCanCreate) return res.status(403).send('non autorisé')
  const form: ISkillCreate = JSON.parse(req.body || '{}')
  await MongoDb()

  const { description, tags, name } = form

  if (!description) return res.status(400).json({ message: 'La description est obligatoire' })
  const isExist = await Skill.findOne({ name })
  if (isExist) return res.status(400).json({ message: 'Ce skill existe déjà' })

  if (tags && tags.length > 0) {
    const existTags = await Tag.find({ label: { $in: tags } })

    await Tag.create([
      ...tags.filter((tag) => !existTags.find((t) => t.label === tag)).map((tag) => ({ name: tag, type: 'skill' })),
    ])
  }

  const skill = await Skill.create({
    ...form,
    description: description,
    users: [],
  })

  return res.status(200).json({ skill })
}
