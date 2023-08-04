import { useMember } from '@/entities'
import { MemberRoles } from './member-roles'

export function MemberCard() {
  const { member } = useMember()

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded border border-arrd-border bg-arrd-bgDark p-4">
      {member.avatar && <img src={member.avatar} className="h-16 w-16 rounded-full" />}
      <div className="grid h-full grid-rows-[auto_1fr] content-between gap-1">
        <div className="text-md uppercase text-arrd-primary">{member.username}</div>
        <div className="flex items-end">
          <MemberRoles />
        </div>
      </div>
    </div>
  )
}