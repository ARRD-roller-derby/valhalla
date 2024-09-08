// Bibliothèques externes
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

// Bibliothèques internes
import { ShortIcon } from '@/ui'
import { dc } from '@/utils'
import { TOption } from '@/types'

interface ListSelectorProps {
  onSelect: (options: TOption) => void
  defaultValue?: TOption
  options: TOption[]
}
export function ListSelector({ onSelect, defaultValue, options }: ListSelectorProps) {
  // state
  const [selected, setSelected] = useState<TOption>(defaultValue || options[0])

  // functions
  const handleSelect = (options: TOption) => {
    setSelected(options)
    onSelect(options)
  }

  return (
    <Listbox value={selected} onChange={handleSelect}>
      <div className="relative mt-1">
        <Listbox.Button className="input relative w-full cursor-pointer">
          <span className="block truncate first-letter:uppercase">{selected.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ShortIcon className="h-5 w-5 fill-arrd-accent" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="input absolute z-40 mb-2 mt-1 max-h-60 w-full overflow-auto">
            {options.map((options) => (
              <Listbox.Option
                key={options.label}
                className={({ active }) =>
                  dc('relative cursor-pointer select-none p-2 first-letter:uppercase', [
                    active,
                    'bg-second text-txtLight',
                  ])
                }
                value={options}
              >
                {({ selected }) => (
                  <span className={dc('block truncate', [selected, 'text-tierce'])}>{options.label}</span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
