// Bibliothèque externe
import { User, Purchase } from '@/models'
import { ObjectId } from 'mongodb'

// Bibliothèque interne
import { trigger } from '@/services'
import { TriggerTypes } from '@/entities'
import { PURCHASE_TYPES } from '@/utils'

/**
 *
 * @ description Ajoute ou retire de l'argent au portefeuille d'un utilisateur et enregistre la transaction
 */
export async function bank(userId: string, amount: number, quantity: number, name?: string) {
  // Empêche d'acheter la même chose deux fois en une heure
  if (name === PURCHASE_TYPES.spyAttendees) {
    const lastPurchase = await Purchase.findOne({
      userId,
      name,
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    })
    if (lastPurchase) return
  }
  const user = await User.findOne(new ObjectId(userId))

  // Si on achète quelque chose
  if (!name && amount < 0) {
    Purchase.create({
      userId: user.id,
      name,
      price: -amount,
      quantity,
      createdAt: new Date(),
    })
  }

  if (user) {
    user.wallet += amount
    user.save()
    trigger(user.id, TriggerTypes.WALLET, {
      value: user.wallet,
    })
  }
}
