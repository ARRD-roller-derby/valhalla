// Bibliothèques externes
import { ROLES, ROLES_CAN_MANAGE_EVENT, checkRoles } from '@/utils'
import { useSession } from 'next-auth/react'

export function useCanSee() {
  const { data: session } = useSession()

  const handleCheckRoles = (roles: string[]) => {
    if (!session) return false
    return checkRoles(roles, session.user)
  }

  return {
    justCoach: handleCheckRoles([ROLES.coach]),
    justEventManager: handleCheckRoles(ROLES_CAN_MANAGE_EVENT),
  }
}
