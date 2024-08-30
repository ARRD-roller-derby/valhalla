import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { authOptions } from '../auth/[...nextauth]'
process.env.TZ = 'Europe/Paris'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'
import { User, Badge } from '@/models'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

export default async function badges(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  await MongoDb()

  const badges_ = await Badge.find()
  const user = await User.findById(session.user.id)

  console.log('badges', badges_)
  const badges = badges_.map((badge) => {
    if (user?.badges?.includes(badge._id)) {
      return {
        ...badge.toObject(),
        win: true,
      }
    }
    return {
      ...badge.toObject(),
      win: false,
    }
  })
  return res.status(200).json({ badges })
}
