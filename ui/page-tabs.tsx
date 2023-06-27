import { Tab } from '@headlessui/react'
import React from 'react'

interface ITab {
  element: React.ReactNode
  title: string
}

export function PageTabs({ tabs }: { tabs: ITab[] }) {
  return (
    <Tab.Group>
      <Tab.List className="flex justify-center gap-4 sticky top-0 bg-bg">
        {tabs.map((tab) => (
          <Tab key={tab.title} className="hover:shadow-none p-0">
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
              <div
                className={
                  'transition ease-in-out duration-200 border-b-2 border-arrd ' +
                  'text-lg md:text-sm ' +
                  (selected ? 'border-tierce' : 'border-transparent ')
                }
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
