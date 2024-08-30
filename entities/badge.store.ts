import { IBadgeSchema } from '@/models/badges.model'
import { create } from 'zustand'

export type IBadge = IBadgeSchema & { win?: boolean }
type State = {
  loading: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingDelete: boolean
  loadingGet: boolean
  badges: IBadge[]
  error: string | null
}

type GET = {
  getBadges: () => Promise<IBadgeSchema[]>
  getBadge: (id: string) => Promise<IBadgeSchema>
  // All the loading states
  getLoading: () => boolean
}

type SET = {
  createBadge: (badge: Partial<IBadgeSchema>) => void
}

type Store = State & GET & SET

export const useBadges = create<Store>((set, get) => ({
  //STATE --------------------------------------------------------------------

  loading: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  loadingGet: false,
  badges: [],
  error: null,

  //GET --------------------------------------------------------------------

  getLoading() {
    return get().loading || get().loadingCreate || get().loadingUpdate || get().loadingDelete || get().loadingGet
  },
  async getBadges() {
    set({ loadingGet: true, error: null, badges: [] })
    try {
      const res = await fetch(`/api/badges`)
      const { badges } = await res.json()
      set({ badges, loadingGet: false })
      return badges
    } catch (err: any) {
      set({ loadingGet: false, error: 'impossible de récupérer la compétence' })
    }
  },
  async getBadge(id: string) {
    set({ loadingGet: true, error: null })
    try {
      const res = await fetch(`/api/badges/${id}`)
      const { badge } = await res.json()
      set((prev) => ({ badges: [...prev.badges.filter((b) => b._id !== badge._id), badge], loadingGet: false }))
      return badge
    } catch (err: any) {
      set({ loadingGet: false, error: 'impossible de récupérer la compétence' })
    }
  },
  //SET --------------------------------------------------------------------
  async createBadge(badge) {
    set({ loadingCreate: true, error: null })
    try {
      const res = await fetch('/api/badges/create', {
        method: 'POST',
        body: JSON.stringify(badge),
      })
      const { badge: newBadge } = await res.json()
      set((state) => ({ badges: [...state.badges, newBadge], loadingCreate: false }))
    } catch (err: any) {
      set({ loadingCreate: false, error: 'impossible de créer la compétence' })
    }
  },
}))
