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
        <div className="grid h-full grid-rows-[auto_1fr] content-between gap-2">
          <Link href={`/repertoire/${member.id}`}>
            <div className="text-md uppercase text-arrd-primary">{member.username}</div>
          </Link>
          {member.type && <div className="text-sm text-arrd-highlight first-letter:uppercase">{member.type}</div>}

          {member?.type?.match(/derby/i) && (member.options_derbyname || member.options_nroster) && (
            <div className="rounded-2 flex items-center justify-between gap-1 border border-arrd-bgLight p-1 text-sm">
              <div className="text-arrd-highlight">{member.options_derbyname}</div>
              <div className="font-bold text-arrd-primary">{member.options_nroster}</div>
            </div>
          )}
          <div className="flex items-end">
            <MemberRoles />
          </div>
        </div>
      </div>
    </Card>
  )
}
