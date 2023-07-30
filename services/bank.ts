import { User } from '@/models'
import { ObjectId } from 'mongodb'
import { trigger } from './trigger'
import { TriggerTypes } from '@/entities'

export async function bank(userId: string, amount: number) {
  const user = await User.findOne(new ObjectId(userId))
  if (user) {
    user.wallet += amount
    user.save()
    trigger(user.id, TriggerTypes.WALLET, {
      value: user.wallet,
    })
  }
}
