// Bibliothèques internes
import { SquareMinusIcon, SquarePlusIcon } from '@/ui'

interface NumInputProps {
  num?: number
  setNum: (value: number) => void
}

export function NumInput({ num = 0, setNum }: NumInputProps) {
  // const
  const iconClasses = 'w-9 h-9 cursor-pointer fill-arrd-primary hover:fill-arrd-highlight'

  return (
    <div className="inline-flex items-center gap-1">
      <button type="button" aria-label="Diminuer la valeur" className="border-0 bg-transparent p-0" onClick={() => setNum(num - 1)}>
        <SquareMinusIcon className={iconClasses} />
      </button>

      <input
        type="number"
        onChange={(e) => {
          const valueStr = e.target.value
          //empêche la saisie de caractère autre que des chiffres
          if (valueStr && !/^\d+$/.test(valueStr)) return
          const value = valueStr ? parseInt(valueStr, 10) : 0
          setNum(value)
        }}
        value={num}
        className="input max-w-[75px]"
      />
      <button type="button" aria-label="Augmenter la valeur" className="border-0 bg-transparent p-0" onClick={() => setNum(num + 1)}>
        <SquarePlusIcon className={iconClasses} />
      </button>
    </div>
  )
}
