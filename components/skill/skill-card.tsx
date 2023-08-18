import { useMember, useSkill } from '@/entities'
import Link from 'next/link'
import { ReadEditor } from '../editor'
import { Card, SkillUserLevelBar } from '@/ui'
import { SKILL_LEVELS_LABELS, dc } from '@/utils'
import { SkillEditModal } from './skill-edit-member.modal'

interface ISkillCardProps {
  editable?: boolean
}
export function SkillCard({ editable }: ISkillCardProps) {
  // Stores -----------------------------------
  const { member } = useMember()
  const { skill } = useSkill()

  // Constantes -----------------------------------

  // Rendu -----------------------------------
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
            <div className="text-sm text-arrd-secondary" key={tag}>
              {'#'}
              {tag}
            </div>
          ))}
        </div>
        {editable && (
          <div className="flex items-center justify-between gap-2">
            Modifier le niveau:
            <SkillEditModal providerAccountId={member.providerAccountId} />
          </div>
        )}
        <div className="text-arrd-textSecondary  flex flex-col gap-2 text-sm">
          <SkillUserLevelBar providerAccountId={member.providerAccountId} />
          {
            <div
              className={dc('text-center text-xs', [skill.msp, 'text-arrd-primary', 'text-arrd-textError opacity-50'])}
            >
              {skill.msp ? 'Inclus' : 'Non inclus'} dans les MSP
            </div>
          }
        </div>
      </div>
    </Card>
  )
}
