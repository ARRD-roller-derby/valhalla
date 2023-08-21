import { useMember } from '@/entities'
import { MemberRoles } from './member-roles'
import { Card } from '@/ui'
import Link from 'next/link'

export function MemberCard() {
  // Stores ---------------------------------------------------------
  const { member } = useMember()

  // Rendu ----------------------------------------------------------
  return (
    <Card>
      <div className="grid grid-cols-[auto_1fr] items-center gap-3 ">
        {member.avatar && <img src={member.avatar} className="h-16 w-16 rounded-full" />}
        <div className="grid h-full grid-rows-[auto_1fr] content-between gap-1">
          <Link href={`/repertoire/${member.id}`}>
            <div className="text-md uppercase text-arrd-primary">{member.username}</div>
          </Link>
          {member.type && <div className="text-sm text-arrd-highlight first-letter:uppercase">{member.type}</div>}
          <div className="flex items-end">
            <MemberRoles />
          </div>
        </div>
      </div>
    </Card>
  )
}
