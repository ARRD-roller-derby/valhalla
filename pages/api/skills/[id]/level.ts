import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { IUserSkill, Skill } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { ROLES, checkRoles } from '@/utils'
import { TriggerTypes } from '@/entities'
import { trigger } from '@/services'
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

export default async function skill_level(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  if (!user) return res.status(403).send('non autorisé')

  const canDelete = checkRoles([ROLES.coach], user)
  if (!canDelete) return res.status(403).send('non autorisé')

  const { providerAccountId, level } = JSON.parse(req.body || '{}')

  if (!providerAccountId || !level) return res.status(400).send('mauvais format de requête')
  await MongoDb()

  await Skill.updateMany(
    {
      _id: { $in: req.query.id },
      'users.providerAccountId': { $ne: providerAccountId },
    },
    {
      $push: {
        users: {
          providerAccountId,
          notAcquired: dayjs().toDate(),
          learned: null,
          master: null,
        },
      },
    }
  )

  const key = `users.$.${level}`

  const setKeys: {
    [key: string]: any
  } = {
    [key]: dayjs().toDate(),
  }

  if (level === 'notAcquired') {
    setKeys['users.$.learned'] = null
    setKeys['users.$.master'] = null
  }

  if (level === 'learned') {
    setKeys['users.$.master'] = null
  }

  await Skill.updateOne(
    {
      _id: req.query.id,
      'users.providerAccountId': providerAccountId, // Filtre pour l'utilisateur spécifique
    },
    {
      $set: { ...setKeys },
    }
  )

  const skillToSend = await Skill.findById(new ObjectId(req.query.id as string))

  return res.status(200).json({ skill: skillToSend })
}
