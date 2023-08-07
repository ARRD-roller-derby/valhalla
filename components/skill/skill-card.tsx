import { useSkill } from '@/entities'
import Link from 'next/link'
import { ReadEditor } from '../editor'

export function SkillCard() {
  const { skill } = useSkill()

  return (
    <div className="flex flex-col  gap-3 rounded border border-arrd-border bg-arrd-bgDark p-2">
      <div className="flex flex-col gap-1">
        <Link href={`/skills/${skill._id}`}>
          <div className="text-md w-full rounded border border-arrd-secondary p-2 text-center  uppercase text-arrd-textExtraLight">
            {skill.name}
          </div>
          <div className="text-arrd-textSecondary pb-2 text-sm">
            {skill.description && <ReadEditor content={skill.description} />}
          </div>
        </Link>
      </div>
    </div>
  )
}
