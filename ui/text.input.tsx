// Bibliothèques internes
import { CrossIcon } from '@/ui'

interface TextInputProps {
  value: string
  setValue: (value: string) => void
  longText?: boolean
  placeholder?: string
}

export function TextInput({ value, longText, placeholder, setValue }: TextInputProps) {
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
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      <button
        type="button"
        aria-label="Effacer le texte"
        className="fill-arrd flex items-center justify-center border-0 bg-transparent p-0"
        onClick={() => setValue('')}
      >
        <CrossIcon />
      </button>
    </div>
  )
}
