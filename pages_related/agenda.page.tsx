// Bibliothèques externes
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { Calendar, NextEvents, EventFormModal } from '@/components'
import { AuthLayout } from '@/layout'
import { Button, PageTabs } from '@/ui'
import { ROLES, checkRoles } from '@/utils'
import { useMemo } from 'react'

export function Agenda() {
  // Stores
  const { data: session } = useSession()
  const user = session?.user

  // const
  const canSee = useMemo(() => {
    if (!session?.user) return false
    return checkRoles([ROLES.bureau, ROLES.coach, ROLES.evenement], session.user)
  }, [session])

  if (!user) return <></>
  return (
    <AuthLayout title="Agenda">
      <div className="grid h-full grid-rows-[auto_1fr_auto] items-start gap-1 p-2">
        <PageTabs
          tabs={[
            {
              title: 'événements',
              tab: 'events',
              element: (
                <div className="flex flex-col gap-3 p-2">
                  {canSee && (
                    <div className="flex justify-end">
                      <EventFormModal
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
      </div>
    </AuthLayout>
  )
}
