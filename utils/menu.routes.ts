import { AddressBookIcon, AgendaIcon, GameIcon, SkillIcon } from '@/ui'

export const routes = [
  {
    name: 'agenda',
    path: '/agenda',
    icon: AgendaIcon,
    inMenu: true,
  },
  {
    name: 'skills',
    path: '/skills',
    icon: SkillIcon,
    inMenu: true,
  },
  {
    name: 'jeux',
    path: '/jeux',
    icon: GameIcon,
    inMenu: true,
  },
  {
    name: 'répertoire',
    path: '/repertoire',
    icon: AddressBookIcon,
    inMenu: true,
  },
]
