// Bibliothèque interne
import { TOption } from '@/types'

export const APP_NAME = 'Valhalla'
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || ''
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || ''
export const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || ''
export const MONGO_URI = process.env.MONGO_URI || ''
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || ''
export const PUSHER_SECRET = process.env.PUSHER_SECRET || ''
export const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || ''
export const PUSHER_API_ID = process.env.NEXT_PUBLIC_PUSHER_API_ID || ''
export const PUSHER_REGION = process.env.NEXT_PUBLIC_PUSHER_REGION || ''

export const DISCORD_EVENT_HOOK = process.env.DISCORD_EVENT_HOOK || ''
export const DISCORD_NEWS_HOOK = process.env.DISCORD_NEWS_HOOK || ''
export const DISCORD_ADMIN_HOOK = process.env.DISCORD_ADMIN_HOOK || ''
export const DOLAPIKEY = process.env.DOLAPIKEY || ''
export const DOL_URL = process.env.DOL_URL || ''

export const WEATHER_API_URL = process.env.WEATHER_API_URL || ''

export const S3_BUCKET = process.env.S3_BUCKET || ''
export const S3_ENDPOINT = process.env.S3_ENDPOINT || ''
export const S3_KEY = process.env.S3_KEY || ''
export const S3_PRIVATE = process.env.S3_PRIVATE || ''
export const S3_REGION = process.env.S3_REGION || ''

export const DISCORD_LINKS = {
  event: DISCORD_EVENT_HOOK,
  news: DISCORD_NEWS_HOOK,
  logs: DISCORD_ADMIN_HOOK,
}

export const frequencyOpts: TOption[] = [
  { label: 'Tous les jours', value: 'day' },
  { label: 'Toutes les semaines', value: 'week' },
  { label: 'Tous les mois', value: 'month' },
  { label: 'Tous les ans', value: 'year' },
]

export const ROLES = {
  invite: 'invité',
  membre: 'membre',
  bureau: 'bureau',
  dev: 'dev',
  coach: 'coach',
  evenement: 'evénement',
  merch: 'merch',
  refs: 'refs',
  discrimination: 'discrimination',
  com: 'com',
  fresh: 'fresh',
}

export const ROLES_CAN_MANAGE_EVENT = [ROLES.bureau, ROLES.coach, ROLES.evenement]

export const PARTICIPATION_TYPES = {
  coach: 'coach',
  'assist-coach': 'assist-coach',
  skater: 'patineur.euse',
  visitor: 'visiteur.euse / NSO',
  organizer: 'organisateur.trice',
  invite: 'invité.e',
  absent: 'absent.e',
}

export const PURCHASE_TYPES = {
  spyAttendees: 'spyAttendees',
  buyCard: 'buyCard',
  sellCard: 'sellCard',
}

export const SKILL_CATEGORIES = {
  derby: 'derby',
  patinage: 'patinage',
}

export const SKILL_SUB_CATEGORIES = {
  fondamental: 'Fondamentaux',
  stability: 'Stabilité et contrôle',
  engagement: 'Engagement et retour à la stabilité',
}

export const SKILL_LEVELS = {
  base: 'base',
  intermediate: 'intermédiaire',
  advanced: 'avancé',
  master: 'maîtrise',
}

// utilisé pour les filtres, mais aussi pour définir l'ordre d'affichage des skills
export const SKILL_LEVELS_LABELS = ['base', 'intermédiaire', 'avancé', 'maîtrise']

//regimes Alimentaire, ref à dolibarr
export const DIET = [
  { label: 'Omnivore', value: '1' },
  { label: 'Végétarien', value: '2' },
  { label: 'Végétalien', value: '3' },
  { label: 'Pesco végétarien', value: '4' },
  { label: 'Crudivore', value: '5' },
  { label: 'Paléo', value: '6' },
  { label: 'Sans Gluten', value: '8' },
]
