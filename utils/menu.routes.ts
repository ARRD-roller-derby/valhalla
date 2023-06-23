import { AddressBookIcon } from '@/ui/icons/address-book.icon'
import { AgendaIcon } from '@/ui/icons/agenda.icon'
import { GameIcon } from '@/ui/icons/game.icon'
import { SkillIcon } from '@/ui/icons/skill.icon'

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
