import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { checkRoles } from '@/utils/check-roles'
import { Event, Tag } from '@/models'
import { authOptions } from '../auth/[...nextauth]'
import { publicParticipants } from '@/utils'
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

export default async function tags(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  const isCanView = checkRoles(['coach'], user)
  if (!isCanView) return res.status(403).send('non autorisé')
  const type = req.query.type as string

  await MongoDb()
  const tags = await Tag.find({ type }).sort({ name: 1 })

  return res.status(200).json({ tags })
}
