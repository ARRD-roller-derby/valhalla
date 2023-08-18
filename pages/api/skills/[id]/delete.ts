import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Skill } from '@/models'
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

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

export default async function skill_delete(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  if (!user) return res.status(403).send('non autorisé')

  const canDelete = checkRoles([ROLES.coach], user)
  if (!canDelete) return res.status(403).send('non autorisé')

  await MongoDb()
  const skill = await Skill.findOne({ _id: req.query.id })
  if (!skill) return res.status(404).send('compétence non trouvée')
  await skill.deleteOne()

  await trigger('public', TriggerTypes.SKILLS, {
    value: {
      delete: skill._id,
    },
  })

  return res.status(200).json({
    message: 'compétence supprimée',
  })
}
