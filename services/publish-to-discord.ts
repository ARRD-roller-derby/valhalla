// Bibliothèque interne
import { DISCORD_LINKS } from '@/utils'

export async function publishToDiscord(type: 'event' | 'news' | 'logs', content: string) {
  const webhookUrl = DISCORD_LINKS[type]
  if (!content || !webhookUrl) return

  try {
    // Envoyer le message
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      console.error("Erreur lors de l'envoi du message:", await response.text())
    } else {
      console.log('Message envoyé avec succès', response.status)
    }
  } catch (error) {
    console.error('Erreur lors de la publication sur Discord:', error)
  }
}
