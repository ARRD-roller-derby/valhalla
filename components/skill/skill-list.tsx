import { SkillProvider, useSkills } from '@/entities'
import { Loader } from '@/ui'
import { SKILL_CATEGORIES } from '@/utils'
import { useEffect } from 'react'
import { SkillCard } from './skill-card'

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
    <div className="flex flex-col gap-4 p-3 sm:grid sm:grid-cols-3 lg:grid-cols-4">
      {skills.map((skill) => (
        <SkillProvider skill={skill} key={skill._id.toString()}>
          <SkillCard />
        </SkillProvider>
      ))}
    </div>
  )
}
