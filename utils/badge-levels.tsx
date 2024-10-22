import { DragonIcon } from '@/ui'
import { BirdFlyIcon } from '@/ui/icons/birdFly'
import { DiceIcon } from '@/ui/icons/dice.icon'
import { EggBrokeIcon } from '@/ui/icons/egg-broke.icon'
import { EggIcon } from '@/ui/icons/egg.icon'
import { TireIcon } from '@/ui/icons/tire.icon'

export const BADGE_LEVELS = [
  {
    label: 'Safe Skills - Niveau 1',
    value: 'safe-skills-1',
    icon: EggIcon,
    color: 'fill-arrd-badge-safe-skills-1',
    borderColor: 'border-arrd-badge-safe-skills-1',
  },
  {
    label: 'Safe Skills - Niveau 2',
    value: 'safe-skills-2',
    icon: EggBrokeIcon,
    color: 'fill-arrd-badge-safe-skills-2',
    borderColor: 'border-arrd-badge-safe-skills-2',
  },
  {
    label: 'Safe Skills - Niveau 3',
    value: 'safe-skills-3',
    icon: BirdFlyIcon,
    color: 'fill-arrd-badge-safe-skills-3',
    borderColor: 'border-arrd-badge-safe-skills-3',
  },
  {
    label: 'Roue jaune',
    value: 'roue-jaune',
    icon: TireIcon,
    color: 'fill-arrd-badge-roue-jaune',
    borderColor: 'border-arrd-badge-roue-jaune',
  },
  {
    label: 'Roue verte',
    value: 'roue-verte',
    icon: TireIcon,
    color: 'fill-arrd-badge-roue-verte',
    borderColor: 'border-arrd-badge-roue-verte',
  },
  {
    label: 'Roue bleue',
    value: 'roue-bleue',
    icon: TireIcon,
    color: 'fill-arrd-badge-roue-bleue',
    borderColor: 'border-arrd-badge-roue-bleue',
  },
  {
    label: 'Advanced',
    value: 'advanced',
    icon: DragonIcon,
    color: 'fill-arrd-badge-advanced',
    borderColor: 'border-arrd-badge-advanced',
  },
  {
    label: 'Vie Asso',
    value: 'vie-asso',
    icon: DiceIcon,
    color: 'fill-arrd-badge-vie-asso',
    borderColor: 'border-arrd-badge-vie-asso',
  },
]
