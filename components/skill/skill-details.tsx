// Bibliothèques internes
import { useSkill, useSkills } from '@/entities'
import { ReadEditor, SkillLevelBar } from '@/components'
import { Loader, SkillUserLevelBar } from '@/ui'
import { dc } from '@/utils'

export function SkillDetails() {
  //Stores --------------------------------------------------
  const { loadingCreate } = useSkills()
  const { skill, mySkill } = useSkill()

  // Rendu --------------------------------------------------
  if (!skill) return <></>

  if (loadingCreate)
    return (
      <div className="flex items-center justify-center p-4">
        <Loader />
      </div>
    )
  return (
    <div className="flex flex-col gap-2 px-3">
      <header>
        <h1 className="text-center text-3xl font-bold">{skill?.name}</h1>
      </header>

      <main className="m-auto flex w-full flex-col gap-4 sm:w-96 ">
        <SkillLevelBar />
        {
          <div className={dc('text-center text-sm', [skill.msp, 'text-arrd-primary', 'text-arrd-textError'])}>
            {skill.msp ? 'Inclus' : 'Non inclus'} dans les MSP
          </div>
        }
        {mySkill && <SkillUserLevelBar providerAccountId={mySkill.providerAccountId} />}
        <div>
          <div className="font-bold first-letter:uppercase">
            {skill.name}
            {':'}
          </div>

          <ReadEditor content={skill?.description} fullHeight />
        </div>
      </main>
    </div>
  )
}
