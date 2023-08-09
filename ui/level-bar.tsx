interface LevelBarProps {
  level: string
  percentage: number
}

export function LevelBar({ level, percentage }: LevelBarProps) {
  return (
    <div>
      <h4> {level}</h4>
      <div className="w-full  rounded-lg border border-arrd-border p-1">
        <div className="relative h-4 w-full">
          <div
            className="absolute bottom-0 left-0 top-0 flex flex-row gap-2 rounded-md bg-arrd-secondary"
            style={{
              width: `${percentage}%`,
            }}
          />
          <div
            className="absolute  flex flex-row gap-2 rounded-md text-xs text-arrd-textExtraLight"
            style={{
              // si 0, pas de rem. si 1, 100% - 1rem
              left: percentage < 15 ? `${percentage}%` : `calc(${percentage}% - 2rem)`,
            }}
          >
            {`${percentage}%`}
          </div>
        </div>
      </div>
    </div>
  )
}
