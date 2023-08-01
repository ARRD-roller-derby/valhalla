// Bibliothèques externes
import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'

// Bibliothèques internes
import { dc } from '@/utils'
import { TOption } from '@/types'
import { ShortIcon, Loader } from '@/ui'
import { useDebounce } from '@/hooks'

interface ListSelectorProps {
  defaultValue?: TOption
  options: TOption[]
  loading?: boolean
  onSearch: (value: string) => void
  onSelect: (options: TOption) => void
}
export function AutoCompSelector({ defaultValue, options, loading, onSelect, onSearch }: ListSelectorProps) {
  // state
  const [query, setQuery] = useState(defaultValue?.label || '')
  const [selected, setSelected] = useState<TOption>(defaultValue || options[0])

  // hooks
  const debouncedQuery = useDebounce(query, 500)

  // functions
  const handleSelect = (options: TOption) => {
    setSelected(options)
    onSelect(options)
  }

  // effects
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 5) onSearch(debouncedQuery)
  }, [debouncedQuery])

  return (
    <Combobox value={selected} onChange={handleSelect}>
      <div className="relative mt-1">
        <Combobox.Input
          className="input relative w-full cursor-pointer"
          displayValue={(opt: TOption) => opt.label}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ShortIcon className="h-5 w-5 fill-arrd-accent" />
        </Combobox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Combobox.Options className="absolute z-40 mt-1 flex max-h-36 w-full flex-col gap-1 overflow-auto rounded border border-arrd-secondary bg-arrd-bgDark text-base text-arrd-text shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader />
              </div>
            )}

            {options.length === 0 && query !== '' && !loading && (
              <div className="relative cursor-default select-none px-4 py-2 text-arrd-secondary">Aucun résultat.</div>
            )}

            {options.map((option) => (
              <Combobox.Option
                key={option.label}
                className={({ active }) => dc('relative cursor-pointer select-none p-2', [active, 'bg-arrd-secondary'])}
                value={option}
              >
                {({ selected }) => (
                  <span className={dc('block truncate', [selected, 'text-arrd-highlight'])}>{option.label}</span>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}
