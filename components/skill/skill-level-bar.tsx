// Bibliothèques internes
import { SKILL_LEVELS_LABELS, dc } from '@/utils'
import { useSkill } from '@/entities'

export function SkillLevelBar() {
  //Stores --------------------------------------------------
  const { skill } = useSkill()

  // Rendu --------------------------------------------------

  if (!skill) return <></>
  return (
    <div className="grid  w-full grid-cols-4 justify-center gap-[1px] overflow-hidden rounded-md border border-arrd-border bg-arrd-border text-xs">
      {SKILL_LEVELS_LABELS.map((lvl) => (
        <div
          key={lvl}
          className={dc('p-2 text-center', [
            skill.level === lvl,
            'bg-arrd-secondary text-arrd-textExtraLight',
            'bg-arrd-bg ',
          ])}
        >
          {lvl}
        </div>
      ))}
    </div>
  )
}
