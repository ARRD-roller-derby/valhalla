import { useMember } from '@/entities'
import { dc, ROLES } from '@/utils'

export function MemberRoles() {
  const { member } = useMember()
  return (
    <div className="flex flex-wrap justify-start gap-1 bg-[9b59b6]">
      {member.roles
        .filter((role) => ROLES.membre && role.name !== ROLES.realInvite)
        .map((role) => (
          <div
            key={role.id}
            className={dc('rounded-sm border border-arrd-bgLight p-1 text-xs')}
            style={{ color: role.color }}
          >
            {role.name}
          </div>
        ))}
    </div>
  )
}
