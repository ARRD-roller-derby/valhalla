// Bibliothèque interne
import { AddressBookIcon, AgendaIcon, DeckIcon, GameIcon, ShopIcon } from '@/ui'

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
    name: 'boutique',
    path: '/shop',
    icon: ShopIcon,
    inMenu: true,
  },
  {
    name: 'mon deck',
    path: '/deck',
    icon: DeckIcon,
    inMenu: true,
  },
]
