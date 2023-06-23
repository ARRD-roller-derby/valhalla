import useIsMobile from '@/hooks/is-mobile.hook'
import { AddressBookIcon } from '@/ui/icons/address-book.icon'
import { AgendaIcon } from '@/ui/icons/agenda.icon'
import { GameIcon } from '@/ui/icons/game.icon'
import { SkillIcon } from '@/ui/icons/skill.icon'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function Menu() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const routes = [
    {
      name: 'agenda',
      path: '/agenda',
      icon: AgendaIcon,
    },
    {
      name: 'skills',
      path: '/skills',
      icon: SkillIcon,
    },
    {
      name: 'jeux',
      path: '/jeux',
      icon: GameIcon,
    },
    {
      name: 'répertoire',
      path: '/repertoire',
      icon: AddressBookIcon,
      isAdmin: true,
    },
  ]

  return (
    <div className="flex gap-1 flex-auto justify-around p-3 md:flex-col">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link key={route.name} href={route.path}>
            <div
              className="color-arrd flex gap-1 items-center"
              data-active={router.pathname === route.path}
            >
              <Icon className="fill-arrd text-3xl md:text-base" />
              {!isMobile && ' ' + route.name}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
