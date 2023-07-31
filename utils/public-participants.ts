import { IEvent, IParticipant, IUser } from '@/models'
import { PARTICIPATION_TYPES, ROLES } from './constants'
import { checkRoles } from './check-roles'

export function publicParticipants(event: IEvent, user: IUser): IParticipant[] {
  const canSee = checkRoles([ROLES.bureau, ROLES.coach, ROLES.evenement], user)

  if (canSee) return event?.participants || []

  const participants = event?.participants || []
  return participants.filter((participant: IParticipant) => {
    if (user.id === participant.userId) return true

    if (participant.type === PARTICIPATION_TYPES.coach) return true
    if (participant.type === PARTICIPATION_TYPES['assist-coach']) return true
    if (participant.type === PARTICIPATION_TYPES.organizer) return true
  })
}
