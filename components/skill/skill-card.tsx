import { useSkill } from '@/entities'
import Link from 'next/link'
import { ReadEditor } from '../editor'
import { Card, SkillLevelBar } from '@/ui'
import { SKILL_LEVELS_LABELS, dc } from '@/utils'
import { useSession } from 'next-auth/react'

export function SkillCard() {
  const { data: session } = useSession()
  const { skill } = useSkill()
  const myLevel = skill.users.find((user) => user.userId === session?.user?.id)

  return (
    <Card>
      <div className="flex h-full flex-col  justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Link href={`/skills/${skill._id}`}>
            <div className="text-md w-full rounded border border-arrd-secondary p-2 text-center  uppercase text-arrd-textExtraLight">
              {skill.name}
            </div>
          </Link>
          <div
            className={dc(
              'text-right text-sm uppercase',
              [skill.level === SKILL_LEVELS_LABELS[0], 'text-cyan-400'],
              [skill.level === SKILL_LEVELS_LABELS[1], 'text-blue-400'],
              [skill.level === SKILL_LEVELS_LABELS[2], 'text-yellow-400'],
              [skill.level === SKILL_LEVELS_LABELS[3], 'text-red-400']
            )}
          >
            {skill.level}
          </div>
        </div>
        <div className="text-arrd-textSecondary pb-2 text-sm">
          {skill.description && <ReadEditor content={skill.description} />}
        </div>
        <div className="flex flex-wrap gap-1">
          {skill.tags.map((tag) => (
            <div className="text-sm text-arrd-secondary">
              {'#'}
              {tag}
            </div>
          ))}
        </div>
        <div className="text-arrd-textSecondary mb-2 text-sm">{myLevel && <SkillLevelBar userLevel={myLevel} />}</div>
      </div>
    </Card>
  )
}
