// Bibliothèques externes
import { ListSelector } from '@/ui'

// Bibliothèques internes
import { TOption } from '@/types'

interface SkillUserLevelSelectorProps {
  onSelect: (SkillLevel: string) => void
  defaultValue?: string
}

export function SkillUserLevelSelector({ onSelect, defaultValue }: SkillUserLevelSelectorProps) {
  // Constante -----------------------------------
  const skillLevels = [
    {
      label: 'Non acquis',
      value: 'notAcquired',
    },

    {
      label: 'Appris',
      value: 'learned',
    },
    {
      label: 'Maîtrisé',
      value: 'master',
    },
  ]
  const val = defaultValue ? { label: defaultValue, value: defaultValue } : skillLevels[0]

  // functions -----------------------------------
  const handleSelect = (option: TOption) => {
    onSelect(option.value as string)
  }

  // Rendu -----------------------------------
  return <ListSelector options={skillLevels} onSelect={handleSelect} defaultValue={val} />
}
