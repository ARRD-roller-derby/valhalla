import { useEventStats } from '@/hooks/event-stats.hook'
import { InfoIcon, Loader } from '@/ui'
import { BADGE_LEVELS } from '@/utils/badge-levels'

export function EventStat() {
  const { stats, loading } = useEventStats()

  if (loading)
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    )
  return (
    <div className="p-2">
      <div className="mb-3 flex items-center justify-center gap-2 text-xs italic text-arrd-highlight">
        <div className="flex h-full items-center justify-center fill-arrd-highlight">
          <InfoIcon />
        </div>
        En cours de test...
      </div>

      <div className="flex flex-col gap-3">
        {stats?.map((stat: any) => (
          <div key={stat.level} className="grid w-full grid-cols-[2fr_1fr] border-b border-arrd-border">
            <div className="text-arrd-textPrimary">{BADGE_LEVELS.find((b) => b.value === stat.level)?.label}</div>
            <div
              className={`
            flex flex-col items-center gap-1 
            text-arrd-textError
            data-[excellent=true]:text-arrd-primary
            data-[good=true]:text-arrd-highlight    
            `}
              data-good={stat.completionRate > 30}
              data-excellent={stat.completionRate > 80}
              data-full={stat.completionRate === 100}
            >
              {stat.completionRate.toFixed(0) + '%'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
