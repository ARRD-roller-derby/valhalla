import { dc } from '@/utils'

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: () => void
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" checked={checked} onChange={onChange} className="absolute appearance-none" />
      <div
        className={dc('flex h-5 w-5 items-center justify-center rounded border border-arrd-primary', [
          checked,
          'bg-arrd-primary',
          'bg-arrd-bgDark',
        ])}
      >
        {checked && (
          <div className="left-1  mt-2 h-2 w-3 origin-top-left -rotate-45 transform border-b-2 border-l-2"></div>
        )}
      </div>
      <span className="font-medium text-arrd-primary">{label}</span>
    </label>
  )
}
