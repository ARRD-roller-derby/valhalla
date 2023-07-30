import { IEvent, IParticipant, IUser } from '@/models'
import { PARTICIPATION_TYPES } from './constants'

export function publicParticipants(event: IEvent, user: IUser): IParticipant[] {
  const participants = event?.participants || []
  return participants.filter((participant: IParticipant) => {
    if (user.id === participant.userId) return true

    if (participant.type === PARTICIPATION_TYPES.coach) return true
    if (participant.type === PARTICIPATION_TYPES['assist-coach']) return true
    if (participant.type === PARTICIPATION_TYPES.organizer) return true
  })
}
