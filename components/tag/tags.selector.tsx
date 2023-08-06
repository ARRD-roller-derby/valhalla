// Bibliothèques externes
import { CrossIcon, ListSelector, Loader, ShortIcon } from '@/ui'

// Bibliothèques internes
import { TOption } from '@/types'
import { useTags } from '@/entities'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'

interface TagLevelSelectorProps {
  type: string
  onSelect: (TagLevel: string) => void
  defaultValue?: string
}

export function TagLevelSelector({ type, defaultValue, onSelect }: TagLevelSelectorProps) {
  const comboboxRef = useRef(null) // Référence pour la combobox

  const [selected, setSelected] = useState<string[]>([])
  const [query, setQuery] = useState<string>('')
  const { loading, tags, getTags } = useTags()
  // const
  const val = defaultValue
    ? { label: defaultValue, value: defaultValue }
    : [
        {
          label: 'Débutant',
          value: 'Débutant',
        },
      ][0]

  // functions
  const handleSelect = (opt: string[]) => {
    console.log('______', opt)
    setSelected((prev) => [...prev, query])
    setQuery('')
  }

  const handleDeleteSelect = (opt: string) => {
    setSelected((prev) => prev.filter((item) => item !== opt))
  }

  useEffect(() => {
    getTags(type)
  }, [])

  //TODO ajouter une drop liste, ou faire comme ShopList
  return (
    <div className="input relative mt-1 flex w-full flex-col  gap-1" ref={comboboxRef}>
      <div className="flex flex-wrap gap-1 text-xs">
        {selected.map((select) => (
          <div key={select} className="flex items-center justify-between gap-1 rounded-md bg-arrd-primary p-1">
            {select}
            <div className="cursor-pointer fill-white" onClick={() => handleDeleteSelect(select)}>
              <CrossIcon />
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Combobox value={selected} onChange={handleSelect}>
          <div className="relative w-full">
            <Combobox.Input
              className="relative w-full border-none bg-transparent py-1"
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center">
              <ShortIcon className="h-5 w-5 fill-arrd-accent" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="input absolute  -top-16 right-0 z-40 mb-2 mt-1 max-h-60 w-full overflow-auto border border-arrd-secondary">
              {tags.length === 0 && query !== '' ? (
                <Combobox.Option value={query}>
                  <div className="relative cursor-pointer px-4 py-2 ">"{query}"</div>
                </Combobox.Option>
              ) : (
                tags.map((tag) => (
                  <Combobox.Option
                    key={tag._id.toString()}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={tag.name}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{tag.name}</span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </Combobox>
      )}
    </div>
  )
}
