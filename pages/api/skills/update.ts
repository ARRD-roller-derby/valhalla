import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDb } from '@/db'
import { checkRoles } from '@/utils/check-roles'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { ISkill, Skill, Tag } from '@/models'
import { ROLES, publicSkillUser } from '@/utils'
import { ObjectId } from 'mongodb'
import { trigger } from '@/services'
import { TriggerTypes } from '@/entities'

process.env.TZ = 'Europe/Paris'

export default async function skill_update(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  const isCanUpdate = checkRoles([ROLES.coach], user)
  if (!isCanUpdate) return res.status(403).send('non autorisé')
  const form: ISkill = JSON.parse(req.body || '{}')
  await MongoDb()

  const { description, tags, name } = form

  if (!description) return res.status(400).json({ message: 'La description est obligatoire' })
  const isExistCount = await Skill.count({ name })
  if (isExistCount > 1) return res.status(400).json({ message: 'Ce skill existe déjà' })

  if (tags && tags.length > 0) {
    const existTags = await Tag.find({ label: { $in: tags } })

    await Tag.create([
      ...tags.filter((tag) => !existTags.find((t) => t.label === tag)).map((tag) => ({ name: tag, type: 'skill' })),
    ])
  }

  await Skill.updateOne(
    {
      _id: new ObjectId(form._id),
    },
    {
      ...form,
    }
  )

  const skill = await Skill.findById(new ObjectId(form._id))

  await trigger('public', TriggerTypes.SKILLS, {
    value: {
      userId: user.id,
      skill: {
        ...skill.toJSON(),

        users: publicSkillUser(skill, user),
      },
    },
  })

  return res.status(200).json({ skill })
}
