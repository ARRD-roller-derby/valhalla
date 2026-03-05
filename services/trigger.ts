import { TriggerTypes } from '@/entities'

/**
 *
 * @param room L'id de l'utilisateur ou 'public'
 * @param action Wallet, event...
 * @param body des infos à passer ?
 */
export async function trigger(room: string, action: TriggerTypes, body: any) {
  try {
    fetch(`${process.env.WS_URL}/send`, {
      method: 'POST',
      body: JSON.stringify({
        room,
        action: {
          type: action,
          ...body,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-provider-id': room,
      },
    })
  } catch (error) {
    console.error('Failed to trigger event', error)
  }
}
