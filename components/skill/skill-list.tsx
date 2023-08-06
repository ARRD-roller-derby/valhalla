import { useSkills } from '@/entities'
import { Loader } from '@/ui'
import { SKILL_CATEGORIES } from '@/utils'
import { useEffect } from 'react'

interface SkillListProps {
  category?: string
}

export function SkillList({ category }: SkillListProps) {
  const { loading, skills, fetchSkills } = useSkills()

  useEffect(() => {
    fetchSkills(category || SKILL_CATEGORIES.derby)
  }, [])

  if (loading) return <Loader />
  return (
    <div>
      {skills.map((skill) => (
        <div key={skill._id.toString()}> {skill.name}</div>
      ))}
    </div>
  )
}
