// Bibliothèques externes
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'

// Bibliothèques internes
import { dc } from '@/utils'

interface ITab {
  element: React.ReactNode
  title: string
  tab: string
}

export function PageTabs({ tabs }: { tabs: ITab[] }) {
  // hooks
  const { query } = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)

  // const
  const defaultTab = useMemo(() => {
    const idx = tabs.findIndex((tab) => tab.tab === query.tab)
    if (!query.tab || idx < 0) return 0
    return idx
  }, [query])

  // functions
  const handleClick = (tab: ITab) => {
    setSelectedIndex(tabs.findIndex((t) => t.tab === tab.tab))
    const params = new URLSearchParams(window.location.search)
    params.set('tab', tab.tab)
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
  }

  useEffect(() => {
    if (query.tab) {
      const idx = tabs.findIndex((tab) => tab.tab === query.tab)
      if (idx >= 0 && idx !== selectedIndex) setSelectedIndex(idx)
    }
  }, [query])

  return (
    <Tab.Group defaultIndex={defaultTab} selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="sticky -top-1 z-10 flex flex-wrap justify-center gap-4 bg-arrd-bg p-1 text-arrd-primary">
        {tabs.map((tab) => (
          <Tab key={tab.title} className="p-0 hover:shadow-none" onClick={() => handleClick(tab)}>
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
              <div
                className={dc('text-md  border-b-2 transition duration-200 ease-in-out first-letter:uppercase', [
                  selected,
                  'border-arrd-highlight',
                  'border-arrd-primary',
                ])}
              >
                {tab.title}
              </div>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="relative h-full">
        {tabs.map((tab) => (
          <Tab.Panel key={tab.title} className="h-full">
            {tab.element}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}
