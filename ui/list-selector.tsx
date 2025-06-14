// Bibliothèques externes
import { Fragment, useMemo, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

// Bibliothèques internes
import { CheckBadgeIcon, ShortIcon } from '@/ui'
import { dc } from '@/utils'
import { TOption } from '@/types'

interface ListSelectorProps {
  onSelect: (options: TOption) => void
  defaultValue?: TOption
  options: TOption[]
  isMulti?: boolean
}
export function ListSelector({ onSelect, defaultValue: dv, options, isMulti = false }: ListSelectorProps) {
  // state

  const defaultValue = useMemo(() => {
    if (isMulti) return []
    return dv || options[0]
  }, [dv, options, isMulti])

  const [selected, setSelected] = useState<TOption | TOption[]>(defaultValue)

  // functions
  const handleSelect = (options: TOption) => {
    onSelect(options)
    setSelected(options)
  }

  const getSelected = useMemo(() => {
    if (isMulti && Array.isArray(selected)) return selected?.map((option) => option.label).join(', ')
    return Array.isArray(selected) ? selected[0].label : selected?.label
  }, [selected, isMulti])

  return (
    <Listbox value={selected} onChange={handleSelect} multiple={isMulti}>
      <div className="relative mt-1">
        <Listbox.Button className="input  relative w-full cursor-pointer">
          <span className=" block truncate pr-5">{getSelected || 'Sélectionner'}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ShortIcon className="h-5 w-5 fill-arrd-accent" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="input absolute z-40 mb-2 mt-1 max-h-60 w-full overflow-auto">
            {options.map((option: any) => (
              <Listbox.Option
                key={option.label}
                className={({ active }) =>
                  dc('relative cursor-pointer select-none p-2', [active, 'bg-second text-txtLight'])
                }
                value={option}
              >
                {({ selected }) => (
                  <div className="flex items-center gap-2">
                    {option.value.includes(selected) && <CheckBadgeIcon className="fill-arrd-primary" />}
                    <span className={dc('block truncate', [selected, 'text-arrd-tierce'])}>{option.label}</span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
