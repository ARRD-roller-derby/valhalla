// Bibliothèque interne
import { EVENT_TYPES, TEventType } from '@/entities'
import { HandIcon, WhistleIcon, HelpIcon, IslandIcon, OrganizerIcon, SkaterIcon, WalkIcon } from '@/ui'
import { PARTICIPATION_TYPES, ROLES } from '@/utils'

interface IParticipationType {
  label: string
  key: string
  icon: JSX.Element
  type: TEventType[]
  roles: string[]
}

export const participationTypes: IParticipationType[] = [
  {
    label: 'coach',
    key: PARTICIPATION_TYPES.coach,
    icon: <WhistleIcon className="h-6 w-6" />,
    roles: [ROLES.coach],
    type: ['Entraînement de derby', 'Cours de patinage', 'Scrimmage', 'Bootcamp', 'Match'],
  },
  {
    label: 'assist coach',
    key: PARTICIPATION_TYPES['assist-coach'],
    icon: <HelpIcon className="h-6 w-6" />,
    roles: [ROLES.coach],
    type: ['Entraînement de derby', 'Cours de patinage', 'Scrimmage', 'Bootcamp', 'Match'],
  },
  {
    label: 'patineur·euse',
    key: PARTICIPATION_TYPES.skater,
    icon: <SkaterIcon className="h-6 w-6" />,
    roles: [ROLES.membre],
    type: ['Entraînement de derby', 'Cours de patinage', 'Scrimmage', 'Bootcamp', 'Match'],
  },
  {
    label: 'visiteur·euse / NSO',
    key: PARTICIPATION_TYPES.visitor,
    icon: <WalkIcon className="h-6 w-6" />,
    roles: [ROLES.membre],
    type: ['Entraînement de derby', 'Cours de patinage', 'Scrimmage', 'Bootcamp', 'Match'],
  },

  {
    label: 'organisateur·euse',
    key: PARTICIPATION_TYPES.organizer,
    icon: <OrganizerIcon className="h-6 w-6" />,
    roles: [ROLES.coach, ROLES.bureau, ROLES.evenement],
    type: ['Événement', 'En ligne', 'Autre', 'Assemblée générale'],
  },

  {
    label: 'invité.e',
    key: PARTICIPATION_TYPES.invite,
    icon: <HandIcon className="h-6 w-6" />,
    roles: [ROLES.invite],
    type: ['Événement', 'En ligne', 'Autre'],
  },
  {
    label: 'absent·e',
    key: PARTICIPATION_TYPES.absent,
    icon: <IslandIcon className="h-6 w-6" />,
    roles: Object.values(ROLES),
    type: EVENT_TYPES,
  },
]
