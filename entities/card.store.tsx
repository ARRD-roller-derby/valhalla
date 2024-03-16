// === STORE ===================================================================

import { Card } from '@/models/card.model'
import { Booster } from '@/utils/boosters'
import { ReactNode, createContext, useContext } from 'react'
import { create } from 'zustand'

interface CardStore {
  // STATE --------------------------------------------------------------------
  loading: boolean
  loadingSell: boolean
  loadingRevision: boolean
  cards: Card[]
  error: string | null
  revisionMode: boolean
  flashCard: Card | null
  numOfCardsForRevision: number

  // FETCHERS----------------------------------------------------------------
  getCards: () => Promise<void>
  getFlashCard: () => Promise<Card>
  submitAnswer: (id: string, answer: string) => Promise<void>

  // GETTERS----------------------------------------------------------------

  getCard: (id: string) => Card | undefined
  shop: () => Promise<Card[]>

  // SETTERS----------------------------------------------------------------

  buyBooster: (booster: Booster['key']) => Promise<Card[]>
  sellCard: (id: string, cost: number) => Promise<void>
  buyCard: (id: string) => Promise<void>
  setRevisionMode: (mode: boolean) => void
}

export const useCards = create<CardStore>((set, get) => ({
  //=== STATE ================================================================
  loading: false,
  loadingSell: false,
  loadingRevision: false,
  cards: [],
  error: null,
  revisionMode: false,
  flashCard: null,
  numOfCardsForRevision: 0,

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
  async getFlashCard() {
    const { revisionMode } = get()
    set({ loadingRevision: true, error: null })

    try {
      const res = await fetch(`/api/cards/flash`)
      const { flashCard, count } = await res.json()
      set({
        flashCard,
        numOfCardsForRevision: count,
        loadingRevision: false,
        revisionMode: revisionMode ? count > 0 : revisionMode,
      })
      return flashCard
    } catch (error) {
      set({ loadingRevision: false, error: 'Erreur lors du chargement de la carte' })
      return null
    }
  },
  async submitAnswer(id: string, answer: string) {
    set({ loadingRevision: true, error: null })

    try {
      const res = await fetch(`/api/cards/${id}/answer`, {
        method: 'POST',
        body: JSON.stringify({ answer }),
      })
      const flashCard = await res.json()
      set({ flashCard, loadingRevision: false })
      return flashCard
    } catch (error) {
      set({ loadingRevision: false, error: 'Erreur lors de la soumission de la réponse' })
      return null
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

  setRevisionMode(mode: boolean) {
    set({ revisionMode: mode })
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
