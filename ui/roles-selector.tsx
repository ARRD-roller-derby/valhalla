// Bibliothèques externes
import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

// Bibliothèques internes
import { ShortIcon } from '@/ui'
import { dc } from '@/utils'
import { TOption } from '@/types'
import { useMembers } from '@/entities'

interface RolesSelectorProps {
  onSelect: (options: TOption) => void
  defaultValue?: TOption
}
export function RolesSelector({ onSelect, defaultValue }: RolesSelectorProps) {
  // Stores
  const { roles, fetchProfiles } = useMembers()
  // state
  const [selected, setSelected] = useState<TOption>(defaultValue || { label: '@everyone', value: '@everyone' })

  // functions
  const handleSelect = (options: TOption) => {
    setSelected(options)
    onSelect(options)
  }

  // effects
  useEffect(() => {
    fetchProfiles()
  }, [])

  return (
    <Listbox value={selected} onChange={handleSelect}>
      <div className="relative mt-1">
        <Listbox.Button className="input relative w-full cursor-pointer">
          <span className="block truncate">{selected.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ShortIcon className="h-5 w-5 fill-arrd-accent" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="input absolute z-40 mb-2 mt-1 max-h-60 w-full overflow-auto">
            {roles.map((options) => (
              <Listbox.Option
                key={options.name}
                className={({ active }) =>
                  dc('relative cursor-pointer select-none p-2', [active, 'bg-second text-txtLight'])
                }
                value={{
                  label: options.name,
                  value: options.name,
                }}
              >
                {({ selected }) => (
                  <span className={dc('block truncate', [selected, 'text-tierce'])}>{options.name}</span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
