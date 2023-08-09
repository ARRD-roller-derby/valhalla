import { useSkills } from '@/entities'
import { Card } from '@/ui'
import { LevelBar } from '@/ui/level-bar'
import { SKILL_CATEGORIES, SKILL_LEVELS_LABELS } from '@/utils'
import { useEffect } from 'react'

export function SkillMemberStats() {
  const { score, fetchSkillScore } = useSkills()
  const scoreByCategoryAndLevel = score.reduce(
    (
      acc: {
        category: string
        total: number
        AcquiredCount: number
        learnedCount: number
        masterCount: number
        percentage: number
        details: {
          level: string
          total: number
          learnedCount: number
          masterCount: number
          AcquiredCount: number
          percentage: number
        }[]
      }[],
      curr
    ) => {
      const existingCategory = acc.find((item) => item.category === curr.category)

      if (existingCategory) {
        existingCategory.total += curr.total
        existingCategory.AcquiredCount += curr.learnedCount + curr.masterCount
        existingCategory.learnedCount += curr.learnedCount
        existingCategory.masterCount += curr.masterCount
        existingCategory.percentage = Math.round((existingCategory.AcquiredCount / existingCategory.total) * 100)

        existingCategory.details.push({
          level: curr.level,
          total: curr.total,
          learnedCount: curr.learnedCount,
          masterCount: curr.masterCount,
          AcquiredCount: curr.learnedCount + curr.masterCount,
          percentage: Math.round(((curr.learnedCount + curr.masterCount) / curr.total) * 100),
        })
      } else {
        acc.push({
          category: curr.category,
          total: curr.total,
          AcquiredCount: curr.learnedCount + curr.masterCount,
          learnedCount: curr.learnedCount,
          masterCount: curr.masterCount,
          percentage: Math.round(((curr.learnedCount + curr.masterCount) / curr.total) * 100),
          details: [
            {
              level: curr.level,
              total: curr.total,
              learnedCount: curr.learnedCount,
              masterCount: curr.masterCount,
              AcquiredCount: curr.learnedCount + curr.masterCount,
              percentage: Math.round(((curr.learnedCount + curr.masterCount) / curr.total) * 100),
            },
          ],
        })
      }

      return acc
    },
    []
  )

  console.log(scoreByCategoryAndLevel)
  useEffect(() => {
    fetchSkillScore()
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      {scoreByCategoryAndLevel.map((score) => (
        <div key={score.category} className="flex w-full flex-col gap-3 md:w-96">
          <h2>{score.category}</h2>
          <LevelBar level="TOTAL" percentage={score.percentage} />

          <Card>
            <div key={score.category} className="flex flex-col gap-2 ">
              {score.details
                .sort((a, b) => SKILL_LEVELS_LABELS.indexOf(a.level) - SKILL_LEVELS_LABELS.indexOf(b.level))
                .map((detail) => (
                  <LevelBar key={detail.level} level={detail.level} percentage={detail.percentage} />
                ))}
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
