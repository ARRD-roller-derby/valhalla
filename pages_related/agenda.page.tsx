import { Calendar, NextEvents, EventCreateModal } from '@/components'
import { AuthLayout } from '@/layout'
import { Button, PageTabs } from '@/ui'
import { ROLES, checkRoles } from '@/utils'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'

export function Agenda() {
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return null
  const canSee = checkRoles([ROLES.bureau, ROLES.coach, ROLES.evenement], user)

  return (
    <AuthLayout title="Agenda">
      <PageTabs
        tabs={[
          {
            title: 'événements',
            tab: 'events',
            element: (
              <div className="flex flex-col gap-3 p-2">
                {canSee && (
                  <div className="flex justify-end">
                    <EventCreateModal
                      day={dayjs()}
                      customButton={(onClick) => <Button text="Créer un évènement" onClick={onClick} />}
                    />
                  </div>
                )}

                <NextEvents />
              </div>
            ),
          },
          {
            title: 'calendrier',
            tab: 'calendar',
            element: <Calendar />,
          },
        ]}
      />
    </AuthLayout>
  )
}
