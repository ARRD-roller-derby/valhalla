// Bibliothèque externe
import { useEffect } from 'react'

// Bibliothèque interne
import { SkillProvider, useSkills } from '@/entities'
import { Loader } from '@/ui'
import { SKILL_CATEGORIES, SKILL_LEVELS_LABELS } from '@/utils'
import { SkillCard } from '@/components'
import { ISkill } from '@/models'

interface SkillListProps {
  category?: string
  editable?: boolean
}

export function SkillList({ category, editable }: SkillListProps) {
  // Store -----------------------------------
  const { loading, skills, fetchSkills } = useSkills()

  // Const -----------------------------------
  const sortedSkills = (a: ISkill, b: ISkill) => {
    // Trie par niveau en utilisant l'index dans l'array SKILL_LEVELS_LABELS
    const levelA = SKILL_LEVELS_LABELS.indexOf(a.level)
    const levelB = SKILL_LEVELS_LABELS.indexOf(b.level)

    // Si les niveaux sont différents, trie par niveau
    if (levelA !== levelB) {
      return levelA - levelB
    }

    // Si les niveaux sont identiques, trie par ordre alphabétique du nom de la compétence
    return a.name.localeCompare(b.name)
  }

  // Effects -----------------------------------
  useEffect(() => {
    fetchSkills(category || SKILL_CATEGORIES.derby)
  }, [])

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    )

  if (!loading && skills.length === 0)
    return <div className="flex h-full items-center justify-center">Aucune compétence trouvée</div>
  return (
    <div className="flex flex-col gap-4 p-3 sm:grid sm:grid-cols-3 lg:grid-cols-4">
      {skills.sort(sortedSkills).map((skill) => (
        <SkillProvider skill={skill} key={skill._id.toString()}>
          <SkillCard editable={editable} />
        </SkillProvider>
      ))}
    </div>
  )
}
