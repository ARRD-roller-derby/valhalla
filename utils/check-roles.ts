// models
import { IUser, TRole } from '@/models'

export function checkRoles(roles: string[], user: IUser): boolean {
  if (!user?.roles || !user?.roles.length) return false

  const userRoles = user.roles.map((role: TRole) => role.name.toLowerCase())
  const intersection = roles.filter((role) => userRoles.includes(role.toLowerCase()))
  return !!intersection.length
}
