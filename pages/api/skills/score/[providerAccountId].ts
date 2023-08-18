import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Skill } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
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

export default async function skills_score(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')

  const providerAccountId = req.query.providerAccountId as string
  await MongoDb()

  // Ajout de l'utilisateur à tous les skills, s'il n'y est pas déjà
  await Skill.updateMany(
    {
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

  const pipeline = [
    {
      $unwind: '$users',
    },
    {
      $match: {
        'users.providerAccountId': providerAccountId,
      },
    },
    {
      $group: {
        _id: {
          category: '$category',
          level: '$level',
        },
        notAcquiredCount: {
          $sum: {
            $cond: [
              {
                $and: [{ $eq: ['$users.learned', null] }, { $eq: ['$users.master', null] }],
              },
              1,
              0,
            ],
          },
        },
        learnedCount: {
          $sum: {
            $cond: [
              {
                $and: [{ $ne: ['$users.learned', null] }, { $eq: ['$users.master', null] }],
              },
              1,
              0,
            ],
          },
        },
        masterCount: {
          $sum: {
            $cond: [
              {
                $and: [{ $eq: ['$users.learned', null] }, { $ne: ['$users.master', null] }],
              },
              1,
              0,
            ],
          },
        },
        total: {
          $sum: {
            $cond: [
              {
                $ne: ['$users.providerAccountId', null],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id.category',
        level: '$_id.level',
        masterCount: 1,
        notAcquiredCount: 1,
        learnedCount: 1,
        total: 1,
      },
    },
  ]

  const score = await Skill.aggregate(pipeline)
  return res.status(200).json({ score })
}
