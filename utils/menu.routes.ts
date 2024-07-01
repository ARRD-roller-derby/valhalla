// Bibliothèque interne
import { AddressBookIcon, AgendaIcon, BlockQuestionIcon } from '@/ui'

export const routes = [
  {
    name: 'agenda',
    path: '/agenda',
    icon: AgendaIcon,
    inMenu: true,
  },

  {
    name: 'répertoire',
    path: '/repertoire',
    icon: AddressBookIcon,
    inMenu: true,
  },
  {
    name: 'questions',
    path: '/questions',
    icon: BlockQuestionIcon,
    inMenu: true,
    roles: ['bureau', 'dev'],
  },
]
