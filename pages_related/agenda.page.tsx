import { Calendar } from '@/components'
import { EventModal } from '@/components/event-modal'
import { AuthLayout } from '@/layout'
import { Button, PageTabs } from '@/ui'
import { checkRoles } from '@/utils'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'

export function Agenda() {
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return null
  const canSee = checkRoles(['bureau', 'coach', 'Evénements'], user)

  return (
    <AuthLayout title="Agenda">
      <PageTabs
        tabs={[
          {
            title: 'événement',
            element: (
              <div className="flex flex-col gap-3 p-2">
                {canSee && (
                  <div className="flex justify-end">
                    <EventModal
                      day={dayjs()}
                      customButton={(onClick) => (
                        <Button text="Créer un évènement" onClick={onClick} />
                      )}
                    />
                  </div>
                )}

                <div>events</div>
              </div>
            ),
          },
          {
            title: 'calendrier',
            element: <Calendar />,
          },
        ]}
      />
    </AuthLayout>
  )
}
