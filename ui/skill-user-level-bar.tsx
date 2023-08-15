import { dc } from '@/utils'
import { CaretDownIcon } from '@/ui'
import { IUserSkill } from '@/models'
import { useSkill, useSkills } from '@/entities'

interface SkillLevelBarProps {
  providerAccountId: string
}

export function SkillUserLevelBar({ providerAccountId }: SkillLevelBarProps) {
  const { skill } = useSkill()
  const { mySkill } = useSkills()

  const member = mySkill(skill._id, providerAccountId)
  const levelStr = [
    {
      label: 'Non acquis',
      key: 'notAcquired',
    },
    {
      key: 'learned',
      label: 'Appris',
    },
    {
      key: 'master',
      label: 'Maîtrisé',
    },
  ] as Array<{
    label: string
    key: keyof IUserSkill
  }>

  // renvoi le niveau de la compétence, en fonction de l'objet userSkill
  const getSkillLevel = (): string => {
    if (!member) return 'notAcquired'
    if (member.master) {
      return 'master'
    } else if (member.learned) {
      return 'learned'
    } else if (member.notAcquired) {
      return 'notAcquired'
    } else {
      return 'notAcquired'
    }
  }

  const level = getSkillLevel()

  return (
    <div className="grid h-8 grid-cols-3 items-end">
      {levelStr.map((lvl) => (
        <div className="relative" key={lvl.key}>
          {level === lvl.key && (
            <div
              className={dc(
                'leading-0 absolute -top-3 flex flex-col whitespace-nowrap text-xs text-arrd-highlight',
                [lvl.key === 'notAcquired', 'left-0'],
                [lvl.key === 'master', 'right-0']
              )}
            >
              <div>{lvl.label}</div>
              <CaretDownIcon className=" -mt-1 fill-arrd-highlight" />
            </div>
          )}
        </div>
      ))}
      <div className="col-span-4 h-2 rounded-sm bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500" />
    </div>
  )
}
