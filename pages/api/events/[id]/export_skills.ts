import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { MongoDb } from '@/db'
import { Event, IParticipant, IUser, IUserSkill, Skill, User } from '@/models'
import { authOptions } from '../../auth/[...nextauth]'
import { ROLES_CAN_MANAGE_EVENT, checkRoles } from '@/utils'
import { ObjectId } from 'mongodb'
import dayjs from 'dayjs'
process.env.TZ = 'Europe/Paris'
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

export default async function event_export_skills(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')
  const { user } = session
  if (!user) return res.status(403).send('non autorisé')

  const canSee = checkRoles(ROLES_CAN_MANAGE_EVENT, user)

  if (!canSee) return res.status(403).send('non autorisé')
  await MongoDb()

  const event = await Event.findById(new ObjectId(req.query.id as string))
  if (!event) return res.status(404).send('Événement non trouvé')

  const eventType = event.type.match(/derby/) ? 'derby' : 'patinage'
  const participants = event.participants || []
  const presents = participants.filter((p: IParticipant) => p.status === 'présent').map((p: IParticipant) => p.userId)
  const users = await User.find({ _id: { $in: presents } }).select('providerAccountId name')
  console.log(
    'users',
    users,
    users.map((u) => u.providerAccountId)
  )
  // recherche des skills non acquis par les participants
  const skills = await Skill.find({ category: eventType }).select('name category users level msp')

  const csvSkills = skills.map((s) => `${s.name.toUpperCase()}${s.msp ? '(msp)' : ''}`).join(',')
  const csvHeader = `NOM,${csvSkills},OBSERVATIONS`
  const csvBody = users
    .map(
      (p: IUser) =>
        `${p.name.split(' ').join('_')},${skills.map((skills) => {
          const userSkill = skills.users.find((u: IUserSkill) => u.providerAccountId === p.providerAccountId)
          if (!userSkill) return ''
          if (userSkill.learned) return 'X'
          if (userSkill.master) return 'XX'
        })},`
    )
    .join('\n')
  return res.status(200).json({
    csv: `${csvHeader}\n${csvBody}`,
  })
}
