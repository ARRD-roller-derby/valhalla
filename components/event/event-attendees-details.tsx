import { HandIcon } from '@/ui'
import { dc, participationTypes } from '@/utils'

export function EventAttendeesDetails({ participant: p }: any) {
  const icon = participationTypes.find((pType) => pType.key === p.type)?.icon || <HandIcon />
  return (
    <div
      key={p.name}
      className={dc('flex items-center  gap-2 rounded border border-arrd-bgLight p-2', [
        !!p.type.match(/absent/),
        'opacity-50',
      ])}
    >
      <div className="">{p.avatar && <img src={p.avatar} className="h-12 w-12 rounded-full" />}</div>

      <div className="flex-1 text-right font-bold first-letter:uppercase">
        {p.name}
        <div className="flex items-center  justify-end gap-1 text-right text-xs  italic text-arrd-primary ">
          <div className="flex w-3 items-center justify-center fill-arrd-highlight">{icon}</div>
          {p.type} {p.status === 'à confirmer' ? '?' : ''}
        </div>
      </div>
    </div>
  )
}
