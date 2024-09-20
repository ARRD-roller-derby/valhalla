// Bibliothèque interne
import { AddressBookIcon, AgendaIcon, BadgeIcon, BlockQuestionIcon } from '@/ui'
import { RuleIcon } from '@/ui/icons/rule.icon'

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
    name: 'Les règles du Derby',
    path: '/rules',
    icon: RuleIcon,
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
