import { Podium as PodiumType } from '@/entities'

type PodiumProps = {
  podium: PodiumType
}
export function Podium({ podium }: PodiumProps) {
  const reorderedPodium = [podium.podium[1], podium.podium[0], podium.podium[2]]

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="grid grid-cols-3">
        {reorderedPodium.map((winner, index) => (
          <div key={winner.name} className="grid grid-rows-[1fr_auto_auto]">
            <div className="flex flex-col items-center justify-end gap-1 p-2 text-center text-xs">
              <img src={winner.avatar} alt={winner.name} className="h-8 w-8 rounded-full" />
              <div className="truncate">{winner.name}</div>
            </div>
            <div className="relative h-0 bg-arrd-secondary data-[pos='0']:h-4 data-[pos='1']:h-8" data-pos={index}>
              <div className="absolute -left-0 -right-0 top-0 h-3 bg-black/20" />
              <div className="absolute -left-1 -right-1 top-0 h-1 bg-arrd-secondary" />
            </div>
            <div className="flex items-end justify-center bg-arrd-secondary pt-2 text-sm text-white/50">
              {winner.total}
            </div>
          </div>
        ))}
      </div>
      <div
        className="text-center data-[color='all']:text-arrd-link data-[color='argent']:text-zinc-400 data-[color='or']:text-amber-400 data-[color=bronze]:text-orange-800"
        data-color={podium.key}
      >
        {podium.title}
      </div>
    </div>
  )
}
