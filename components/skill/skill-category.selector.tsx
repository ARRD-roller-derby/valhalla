// Bibliothèques externes
import { ListSelector } from '@/ui'

// Bibliothèques internes
import { SKILL_CATEGORIES } from '../../utils/constants'
import { TOption } from '@/types'

interface SkillCategorySelectorProps {
  onSelect: (SkillCategory: string) => void
  defaultValue?: string
}

export function SkillCategorySelector({ onSelect, defaultValue }: SkillCategorySelectorProps) {
  // const
  const Category = [SKILL_CATEGORIES.derby, SKILL_CATEGORIES.patinage]
  const SkillCategories = Category.map((cat) => ({
    label: cat,
    value: cat,
  }))
  const val = defaultValue ? { label: defaultValue, value: defaultValue } : SkillCategories[0]

  // functions
  const handleSelect = (option: TOption) => {
    onSelect(option.value as string)
  }

  return <ListSelector options={SkillCategories} onSelect={handleSelect} defaultValue={val} />
}
