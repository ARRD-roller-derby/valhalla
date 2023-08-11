// Bibliothèques externes
import { ListSelector } from '@/ui'

// Bibliothèques internes
import { SKILL_LEVELS_LABELS } from '@/utils'
import { TOption } from '@/types'

interface SkillLevelSelectorProps {
  onSelect: (SkillLevel: string) => void
  defaultValue?: string
}

export function SkillLevelSelector({ onSelect, defaultValue }: SkillLevelSelectorProps) {
  // const
  const skillLevels = SKILL_LEVELS_LABELS.map((lvl) => ({
    label: lvl,
    value: lvl,
  }))
  const val = defaultValue ? { label: defaultValue, value: defaultValue } : skillLevels[0]

  // functions
  const handleSelect = (option: TOption) => {
    onSelect(option.value as string)
  }

  return <ListSelector options={skillLevels} onSelect={handleSelect} defaultValue={val} />
}
