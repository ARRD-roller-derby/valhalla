import { Card } from '@/models/card.model'

export function getRarity(rarity: Card['rarity']) {
  if (rarity === 'common') return 'commune'
  if (rarity === 'rare') return 'rare'
  if (rarity === 'epic') return 'épique'
  if (rarity === 'legendary') return 'légendaire'

  return rarity
}
