// Bibliothèque interne
import { DISCORD_LINKS } from '@/utils'

export async function publishToDiscord(type: 'event' | 'news' | 'logs', content: string) {
  const url = DISCORD_LINKS[type]
  if (!content || !url) return

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
}
