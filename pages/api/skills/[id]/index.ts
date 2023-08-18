import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Skill } from '@/models'
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
import { ObjectId } from 'mongodb'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

export default async function skill(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session

  const id = req.query.id as string

  await MongoDb()
  // Ajout de l'utilisateur à tous les skills de la catégorie, s'il n'y est pas déjà
  await Skill.updateMany(
    {
      _id: { $in: id },
      'users.providerAccountId': { $ne: session.user.providerAccountId },
    },
    {
      $push: {
        users: {
          providerAccountId: session.user.providerAccountId,
          notAcquired: dayjs().toDate(),
          learned: null,
          master: null,
        },
      },
    }
  )

  const skill = await Skill.findById(new ObjectId(id))

  return res.status(200).json({
    skill: {
      ...skill.toObject(),
      users: publicSkillUser(skill, user),
    },
  })
}
