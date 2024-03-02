// === STORE ===================================================================

import { Card } from '@/models/card.model'
import { Booster } from '@/utils/boosters'
import { create } from 'zustand'

interface CardStore {
  // STATE --------------------------------------------------------------------
  loading: boolean
  cards: Card[]
  error: string | null

  // GETTERS----------------------------------------------------------------

  // SETTERS----------------------------------------------------------------

  buyBooster: (booster: Booster['key']) => Promise<Card[]>
}

export const useCards = create<CardStore>((set, get) => ({
  //=== STATE ================================================================
  loading: false,
  cards: [],
  error: null,

  //=== GETTERS ==============================================================

  //=== SETTERS ==============================================================

  async buyBooster(booster: string) {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`/api/cards/buy/${booster}`)
      const cards = await res.json()
      console.log('__', cards)
      set({ cards, loading: false })
      return cards
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de l’achat du booster' })
      return []
    }
  },
}))
