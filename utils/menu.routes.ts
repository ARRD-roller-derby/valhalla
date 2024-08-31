// Bibliothèque interne
import { AddressBookIcon, AgendaIcon, BadgeIcon, BlockQuestionIcon } from '@/ui'

export const routes: {
  name: string
  path: string
  icon: any
  inMenu: boolean
  roles?: string[]
}[] = [
  {
    name: 'Agenda',
    path: '/agenda',
    icon: AgendaIcon,
    inMenu: true,
  },
  {
    name: 'Badges',
    path: '/badges',
    icon: BadgeIcon,
    inMenu: true,
  },
  {
    name: "L'équipe",
    path: '/repertoire',
    icon: AddressBookIcon,
    inMenu: true,
  },
  {
    name: 'Questions',
    path: '/questions',
    icon: BlockQuestionIcon,
    inMenu: true,
    roles: ['bureau', 'dev'],
  },
]
