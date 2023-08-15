import { useSkill, useSkills } from '@/entities'
import { useEffect } from 'react'
import { ReadEditor } from '../editor'
import { Card, Loader, SkillUserLevelBar } from '@/ui'
import { IUserSkill } from '@/models'
import { SkillEditModal } from '@/components'

export function SkillByMembers() {
  const { skill } = useSkill()
  const { loadingMember, members, fetchSkillByMembers } = useSkills()

  useEffect(() => {
    if (skill) fetchSkillByMembers(skill._id)
  }, [])

  if (!skill) return <></>
  return (
    <div className="flex flex-col gap-2 px-3">
      <header>
        <h1 className="text-center text-3xl font-bold">{skill.name}</h1>
        <div className="flex justify-center text-xs">
          <ReadEditor content={skill.description} fullHeight />
        </div>
      </header>
      <div>
        {loadingMember && members.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <Loader />
          </div>
        )}
        {!loadingMember && members.length > 0 && (
          <div className="flex flex-col gap-4 p-3 sm:grid sm:grid-cols-3 lg:grid-cols-4">
            {members
              .sort((a, b) => {
                const getStatusPriority = (member: IUserSkill) => {
                  if (member.learned) return 1
                  if (member.master) return 2
                  if (member.notAcquired) return 3
                  return 4
                }
                const statusPriorityA = getStatusPriority(a)
                const statusPriorityB = getStatusPriority(b)
                return statusPriorityA - statusPriorityB
              })
              .sort((a, b) => a.username.localeCompare(b.username))
              .map((member) => (
                <Card
                  key={`${member.providerAccountId}-${member.learned || ''}-${member.master || ''}-${
                    member.notAcquired || ''
                  }`}
                >
                  <div className="grid grid-cols-[auto_1fr] items-center gap-3 ">
                    {member.avatar && <img src={member.avatar} className="h-16 w-16 rounded-full" />}
                    <div className="flex h-full justify-between gap-1">
                      <div className="text-md uppercase text-arrd-primary">{member.username}</div>
                      <SkillEditModal providerAccountId={member.providerAccountId} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <SkillUserLevelBar providerAccountId={member.providerAccountId} />
                  </div>
                </Card>
              ))}
          </div>
        )}
        {!loadingMember && members.length === 0 && (
          <div className="flex h-full items-center justify-center">non trouvé</div>
        )}
      </div>
    </div>
  )
}
