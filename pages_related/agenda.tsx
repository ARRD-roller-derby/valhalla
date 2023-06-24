import { AuthLayout } from '@/layout/auth.layout'
import { Calendar } from '@/ui/calendar'
import { PageTabs } from '@/ui/page-tabs'
import { Tab } from '@headlessui/react'

export function Agenda() {
  return (
    <AuthLayout>
      <PageTabs
        tabs={[
          {
            title: 'événement',
            element: (
              <div>
                <div>Bouton creation</div>
                <div>events</div>
              </div>
            ),
          },
          {
            title: 'calendrier',
            element: (
              <div>
                <Calendar />
              </div>
            ),
          },
        ]}
      />
    </AuthLayout>
  )
}
