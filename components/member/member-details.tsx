import { useMember } from '@/entities'
import { MemberRoles } from './member-roles'

export function MemberDetails() {
  const { member } = useMember()

  return (
    <div className="m-auto flex w-full flex-col gap-4 px-3 sm:w-96">
      <header className="flex flex-col items-center justify-center gap-2">
        {member.avatar && <img src={member.avatar} className="h-16 w-16 rounded-full" />}
        <h1 className="text-center text-3xl font-bold">{member?.username}</h1>
      </header>

      <main className="m-auto flex w-full flex-col gap-4 sm:w-96 ">
        <div className="flex items-end">
          <MemberRoles />
        </div>
      </main>
    </div>
  )
}
