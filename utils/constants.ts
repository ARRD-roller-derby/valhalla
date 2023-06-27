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

export const visibilityOpts: TOption[] = [
  { label: 'Membres', value: 'membre' },
  { label: 'Public', value: 'public' },
  { label: 'Admins', value: 'admin' },
  { label: 'Bureau', value: 'bureau' },
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

export const PARTICIPATION_TYPES = {
  coach: 'coach',
  'assist-coach': 'assist-coach',
  skater: 'patineur.euse',
  visitor: 'visiteur.euse / NSO',
  organizer: 'organisateur.trice',
  invite: 'invité.e',
  absent: 'absent.e',
}
