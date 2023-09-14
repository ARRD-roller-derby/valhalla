import { TEventTypeFilter, useEvents, useMembers } from '@/entities'
import { TOption } from '@/types'
import { ListSelector } from '@/ui'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'

export function EventFilterButton() {
  // Stores -------------------------------------------------------------------
  const { data: session } = useSession()
  const { setEventsTypesFilters } = useEvents()

  // Constantes --------------------------------------------------------------
  const options = [
    {
      label: 'Tous les événements',
      value: 'tous',
    },
    {
      label: 'Derby',
      value: 'derby',
    },
    {
      label: 'Patin',
      value: 'patin',
    },
    {
      label: 'Événements sans patins',
      value: 'pieds',
    },
  ]
  const defaultRoles = useMemo(() => {
    if (!session?.user?.roles)
      return {
        label: 'Événements sans patins',
        value: 'pieds',
      }
    const roles = session.user.roles.map((role) => role.name)
    if (roles.includes('patin')) return { label: 'patin', value: 'patin' }
    if (roles.includes('membre') && !roles.includes('derby') && roles.includes('patin'))
      return {
        label: 'Événements sans patins',
        value: 'pieds',
      }
    return {
      label: 'Tous les événements',
      value: 'tous',
    }
  }, [session])

  // State --------------------------------------------------------------------
  const [val, setVal] = useState<TOption>(defaultRoles)

  // Functions --------------------------------------------------------------------
  const handleSelect = (option: TOption) => {
    setVal(option)
    setEventsTypesFilters([option.value as TEventTypeFilter])
  }

  // TODO voir à le mettre en sticky

  // Rendu --------------------------------------------------------------------
  return (
    <div className="m-auto w-full flex-grow md:w-[300px]">
      <ListSelector options={options} onSelect={handleSelect} defaultValue={val} />
    </div>
  )
}
