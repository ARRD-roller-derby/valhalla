import { CrossIcon } from './icons'

interface TextInputProps {
  value: string
  setValue: (value: string) => void
}

export function TextInput({ value, setValue }: TextInputProps) {
  return (
    <div className="input grid grid-cols-[1fr_auto] gap-1 fill-arrd-primary">
      <input
        className="bg-transparent outline-none"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="fill-arrd flex items-center justify-center" onClick={() => setValue('')}>
        <CrossIcon />
      </div>
    </div>
  )
}
