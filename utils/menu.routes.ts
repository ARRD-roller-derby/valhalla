import { AddressBookIcon } from '@/ui/icons/address-book.icon'
import { AgendaIcon } from '@/ui/icons/agenda.icon'
import { GameIcon } from '@/ui/icons/game.icon'
import { SkillIcon } from '@/ui/icons/skill.icon'

export const routes = [
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
