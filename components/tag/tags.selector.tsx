// Bibliothèques externes
import { CrossIcon, Loader, ShortIcon } from '@/ui'

// Bibliothèques internes
import { useTags } from '@/entities'
import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { dc } from '@/utils'

interface TagLevelSelectorProps {
  type: string
  onSelect: (TagLevel: string[]) => void
  defaultValue?: string[]
}

export function TagLevelSelector({ type, defaultValue, onSelect }: TagLevelSelectorProps) {
  // state
  const [selected, setSelected] = useState<string[]>(defaultValue || [])
  const [query, setQuery] = useState<string>('')

  // const
  const { loading, tags, getTags } = useTags()
  const filteredTags = tags.filter((tag) => {
    if (!tag?.name.includes(query)) return false
    if (selected.find((t) => t === tag.name)) return false
    return true
  })

  // Effects
  useEffect(() => {
    getTags(type)
  }, [])

  // functions
  const handleSelect = (opt: string[]) => {
    const value = opt.toString() || query
    setSelected((prev) => {
      if (!value) return prev
      const newValue = [...prev, value]
      onSelect(newValue)
      return newValue
    })
    setQuery('')
  }

  const handleDeleteSelect = (opt: string) => {
    setSelected((prev) => {
      const newValue = prev.filter((item) => item !== opt)
      onSelect(newValue)
      return newValue
    })
  }

  return (
    <div className="input relative mt-1 flex w-full flex-col  gap-1">
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
            <Combobox.Options className="input mb4 absolute bottom-14 right-0 z-40 mt-1 max-h-60 w-full overflow-auto border border-arrd-secondary">
              {filteredTags.length === 0 && query !== '' ? (
                <Combobox.Option value={query}>
                  <div className="relative cursor-pointer px-4 py-2 text-arrd-text">"{query}"</div>
                </Combobox.Option>
              ) : (
                filteredTags.map((tag) => (
                  <Combobox.Option
                    key={tag._id.toString()}
                    className={({ active }) =>
                      dc('relative cursor-pointer select-none p-2', [active, 'bg-second text-txtLight'])
                    }
                    value={tag.name}
                  >
                    {({ selected }) => (
                      <span className={dc('block truncate text-arrd-text', [selected, 'text-tierce'])}>{tag.name}</span>
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
