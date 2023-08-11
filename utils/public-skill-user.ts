// Bibliothèque interne
import { IUserSkill, ISkill, IUser } from '@/models'
import { ROLES, checkRoles } from '@/utils'

export function publicSkillUser(skill: ISkill, user: IUser): IUserSkill[] {
  const canSee = checkRoles([ROLES.coach], user)

  if (canSee) return skill?.users || []

  const users = skill?.users || []
  return users.filter((member: IUserSkill) => {
    if (user.id === member.userId) return true
  })
}
