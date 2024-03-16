// === STORE ===================================================================

import { Card } from '@/models/card.model'
import { Booster } from '@/utils/boosters'
import { ReactNode, createContext, useContext } from 'react'
import { create } from 'zustand'

interface CardStore {
  // STATE --------------------------------------------------------------------
  loading: boolean
  loadingSell: boolean
  cards: Card[]
  error: string | null

  // FETCHERS----------------------------------------------------------------
  getCards: () => Promise<void>
  // GETTERS----------------------------------------------------------------

  getCard: (id: string) => Card | undefined
  shop: () => Promise<Card[]>

  // SETTERS----------------------------------------------------------------

  buyBooster: (booster: Booster['key']) => Promise<Card[]>
  sellCard: (id: string, cost: number) => Promise<void>
  buyCard: (id: string) => Promise<void>
}

export const useCards = create<CardStore>((set, get) => ({
  //=== STATE ================================================================
  loading: false,
  loadingSell: false,
  cards: [],
  error: null,

  //=== FETCHERS ============================================================
  async getCards() {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`/api/cards`)
      const cards = await res.json()
      set({ cards, loading: false })
      return cards
    } catch (error) {
      set({ loading: false, error: 'Erreur lors du chargement des cartes' })
      return []
    }
  },

  async shop() {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`/api/cards/shop`)
      const cards = await res.json()
      set({ cards, loading: false })
      return cards
    } catch (error) {
      set({ loading: false, error: 'Erreur lors du chargement de la boutique' })
      return []
    }
  },

  //=== GETTERS ==============================================================

  getCard(id: string) {
    return get().cards.find((card) => card._id.toString() === id)
  },

  //=== SETTERS ==============================================================

  async buyBooster(booster: string) {
    set({ loadingSell: true, error: null })

    try {
      const res = await fetch(`/api/cards/buy/${booster}`)
      const cards = await res.json()
      set({ cards, loadingSell: false })
      return cards
    } catch (error) {
      set({ loadingSell: false, error: 'Erreur lors de l’achat du booster' })
      return []
    }
  },

  async sellCard(id: string, cost: number = 0) {
    set({ loadingSell: true, error: null })

    try {
      const res = await fetch(`/api/cards/${id}/sell`, {
        method: 'POST',
        body: JSON.stringify({ cost }),
      })
      const cards = await res.json()
      set({ cards, loadingSell: false })
      return cards
    } catch (error) {
      set({ loadingSell: false, error: 'Erreur lors de la vente de la carte' })
      return []
    } finally {
      set({ loadingSell: false })
    }
  },
  async buyCard(id: string) {
    set({ loadingSell: true, error: null })

    try {
      const res = await fetch(`/api/cards/${id}/buy`)
      const cards = await res.json()
      set({ cards, loadingSell: false })
      return cards
    } catch (error) {
      set({ loadingSell: false, error: 'Erreur lors de l’achat de la carte' })
      return []
    }
  },
}))

const CardCtx = createContext<string>('')

type CardProviderProps = {
  id: string
  children: ReactNode
}
export function CardProvider({ id, children }: CardProviderProps) {
  return <CardCtx.Provider value={id}>{children}</CardCtx.Provider>
}

export function useCard() {
  const id = useContext(CardCtx)
  const { getCard, sellCard, buyCard, loadingSell } = useCards()

  return {
    card: getCard(id),
    async sellCard(cost: number) {
      return await sellCard(id, cost)
    },
    buyCard: () => buyCard(id),
    loadingSell,
  }
}
