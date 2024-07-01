// Bibliothèques internes
import { CrossIcon } from '@/ui'

interface TextInputProps {
  value: string
  setValue: (value: string) => void
  longText?: boolean
}

export function TextInput({ value, longText, setValue }: TextInputProps) {
  return (
    <div className="input grid grid-cols-[1fr_auto] gap-1 fill-arrd-primary">
      {longText ? (
        <textarea
          rows={value.split('\n').length + 2}
          className="bg-transparent outline-none"
          onChange={(e) => setValue(e.target.value)}
          defaultValue={value}
        />
      ) : (
        <input
          className="bg-transparent outline-none"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      <div className="fill-arrd flex items-center justify-center" onClick={() => setValue('')}>
        <CrossIcon />
      </div>
    </div>
  )
}
