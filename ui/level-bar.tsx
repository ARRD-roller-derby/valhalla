interface LevelBarProps {
  level: string
  percentage: number
}

export function LevelBar({ level, percentage }: LevelBarProps) {
  const percent = percentage > 100 ? 0 : percentage
  return (
    <div>
      <h4> {level}</h4>
      <div className="w-full  rounded-lg border border-arrd-border p-1">
        <div className="relative h-4 w-full">
          <div
            className="absolute bottom-0 left-0 top-0 flex flex-row gap-2 rounded-md bg-arrd-secondary transition-all duration-500"
            style={{
              width: `${percent}%`,
            }}
          />
          <div
            className="absolute  flex flex-row gap-2 rounded-md text-xs text-arrd-textExtraLight transition-all duration-500"
            style={{
              // si 0, pas de rem. si 1, 100% - 1rem
              left: percent < 15 ? `${percent}%` : `calc(${percent}% - 2rem)`,
            }}
          >
            {`${percent}%`}
          </div>
        </div>
      </div>
    </div>
  )
}
