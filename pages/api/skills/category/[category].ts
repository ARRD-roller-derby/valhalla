import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { IUserSkill, Skill } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { publicSkillUser } from '@/utils'
process.env.TZ = 'Europe/Paris'

import dayjs from 'dayjs'
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

export default async function skills_by_cat(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const category = req.query.category as string

  await MongoDb()

  // Ajout de l'utilisateur à tous les skills de la catégorie, s'il n'y est pas déjà
  await Skill.updateMany(
    {
      category,
      'users.userId': { $ne: session.user.id },
    },
    {
      $push: {
        users: {
          userId: session.user.id,
          notAcquired: dayjs().toDate(),
          learned: null,
          master: null,
        },
      },
    }
  )

  const skills = await Skill.find({ category })

  const skillsFiltered = skills.map((skill) => {
    const { users, ...rest } = skill.toObject()
    return {
      ...rest,
      users: publicSkillUser(skill, user),
    }
  })
  return res.status(200).json({ skills: skillsFiltered })
}
