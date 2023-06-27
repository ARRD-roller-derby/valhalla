import { dc } from '@/utils'
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

interface ITab {
  element: React.ReactNode
  title: string
  tab: string
}

export function PageTabs({ tabs }: { tabs: ITab[] }) {
  const { query, push } = useRouter()
  const defaultTab = useMemo(() => {
    const idx = tabs.findIndex((tab) => tab.tab === query.tab)
    if (!query.tab || idx < 0) return 0
    return idx
  }, [query])

  const handleClick = (tab: ITab) => {
    push({ query: { ...query, tab: query.tab } }, { query: { ...query, tab: tab.tab } }, { shallow: true })
  }
  return (
    <Tab.Group defaultIndex={defaultTab}>
      <Tab.List className="sticky -top-1 z-10 flex justify-center gap-4 bg-arrd-bg p-1 text-arrd-primary">
        {tabs.map((tab) => (
          <Tab key={tab.title} className="p-0 hover:shadow-none" onClick={() => handleClick(tab)}>
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
              <div
                className={dc(
                  'border-b-2  text-lg transition duration-200 ease-in-out first-letter:uppercase md:text-sm',
                  [selected, 'border-arrd-highlight', 'border-arrd-primary']
                )}
              >
                {tab.title}
              </div>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {tabs.map((tab) => (
          <Tab.Panel key={tab.title}>{tab.element}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}
