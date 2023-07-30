import { TriggerTypes } from '@/entities'
import { PUSHER_API_ID, PUSHER_KEY, PUSHER_REGION, PUSHER_SECRET } from '@/utils'
import Pusher from 'pusher'

/**
 *
 * @param event L'id de l'utilisateur ou 'public'
 * @param type Wallet, event...
 * @param body des infos à passer ?
 */
export function trigger(event: string, type: TriggerTypes, body: any) {
  const pusher = new Pusher({
    appId: PUSHER_API_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_REGION,
    useTLS: true,
  })

  pusher.trigger('valhalla', event, { ...body, type })
}
