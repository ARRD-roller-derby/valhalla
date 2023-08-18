// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { DangerZone, Loader, PageTabs } from '@/ui'
import { useEffect } from 'react'
import { SkillProvider, TriggerTypes, useSkills, useSocketTrigger } from '@/entities'
import { useRouter } from 'next/router'
import { SkillByMembers, SkillDeleteBtn, SkillDetails, SkillFormModal } from '@/components'
import { useCanSee } from '@/hooks/can-see.hooks'
import { ISkill } from '@/models'

export function Skill() {
  // Hooks --------------------------------------------------
  const { query } = useRouter()
  const { justCoach } = useCanSee()

  // Stores --------------------------------------------------
  const { data: session } = useSession()
  const { getSkill, fetchSkill, socketEvt } = useSkills()

  // Const --------------------------------------------------
  const skill = getSkill(query.id as string)
  const user = session?.user
  const tabs = [
    {
      title: 'details',
      tab: 'details',
      element: (
        <div className="flex flex-col gap-3 p-2">
          <div className="flex justify-end">
            <SkillFormModal skill={skill} />
          </div>
          <SkillDetails />
          <div className="m-auto w-full sm:w-96">
            <DangerZone>
              <div className=" flex w-full justify-end gap-2 text-xs">
                <SkillDeleteBtn />
              </div>
            </DangerZone>
          </div>
        </div>
      ),
    },
    {
      title: 'membres',
      tab: 'membres',
      element: <SkillByMembers />,
    },
  ]

  // Effets --------------------------------------------------
  useSocketTrigger<{ event: ISkill }>(TriggerTypes.SKILLS, socketEvt)
  useEffect(() => {
    fetchSkill(query.id as string)
  }, [query.id])

  // Render --------------------------------------------------
  if (!user) return <></>

  if (!skill)
    return (
      <AuthLayout title="Ma progression">
        <div className="flex h-full w-full items-center justify-center p-3">
          <Loader />
        </div>
      </AuthLayout>
    )

  return (
    <AuthLayout title={skill.name}>
      <SkillProvider skill={skill}>
        {justCoach ? (
          <div className="grid h-full grid-rows-[auto_1fr_auto] items-start gap-1 p-2">
            <PageTabs tabs={tabs} />
          </div>
        ) : (
          <SkillDetails />
        )}
      </SkillProvider>
    </AuthLayout>
  )
}
