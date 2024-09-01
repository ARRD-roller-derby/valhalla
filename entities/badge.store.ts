import { IBadgeSchema } from '@/models/badges.model'
import { create } from 'zustand'

export type WinnerPodium = {
  name: string
  avatar: string
  total: number
}

export type Podium = {
  total: number
  key: string
  title: string
  podium: [WinnerPodium, WinnerPodium, WinnerPodium]
}

export type IBadge = IBadgeSchema & { win?: boolean }
type State = {
  loading: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingDelete: boolean
  loadingGet: boolean
  badges: IBadge[]
  hallOfFame: Podium[]
  error: string | null
}

type GET = {
  getBadges: (userId?: string) => Promise<IBadgeSchema[]>
  getBadge: (id: string) => Promise<IBadgeSchema>
  // All the loading states
  getLoading: () => boolean
  getCount: () => Promise<number>
  getHallOfFame: () => Promise<Podium[]>
}

type SET = {
  createBadge: (badge: Partial<IBadgeSchema>) => void
  unlockBadge: (badgeId: string, userId: string) => void
}

type Store = State & GET & SET

export const useBadges = create<Store>((set, get) => ({
  //STATE --------------------------------------------------------------------

  loading: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  loadingGet: false,
  hallOfFame: [],
  badges: [],
  error: null,

  //GET --------------------------------------------------------------------

  getLoading() {
    return get().loading || get().loadingCreate || get().loadingUpdate || get().loadingDelete || get().loadingGet
  },
  async getBadges(userId?: string) {
    set({ loadingGet: true, error: null, badges: [] })
    try {
      const res = await fetch(`/api/badges?${userId ? new URLSearchParams({ userId }).toString() : ''}`)
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
  async getCount() {
    set({ error: null })
    try {
      const res = await fetch('/api/badges/count')
      const { count } = await res.json()
      return count
    } catch (err: any) {
      set({ error: 'impossible de récupérer le nombre de compétences' })
    }
  },
  async getHallOfFame() {
    set({ loadingGet: true, error: null, badges: [] })
    try {
      const res = await fetch('/api/badges/hall_of_fame')
      const hallOfFame = await res.json()
      set({ hallOfFame, loadingGet: false })
      return hallOfFame
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
      set((state) => ({ badges: [...state.badges, { ...newBadge, win: false }], loadingCreate: false }))
    } catch (err: any) {
      set({ loadingCreate: false, error: 'impossible de créer la compétence' })
    }
  },
  async unlockBadge(badgeId, userId) {
    const badges = get().badges
    set((prev) => ({
      loadingUpdate: true,
      error: null,
      badges: prev.badges.map((b) => (b._id === badgeId ? { ...b, win: !b.win } : b)),
    }))

    try {
      await fetch(`/api/badges/${badgeId}/unlock/${userId}`, {
        method: 'PUT',
      })
    } catch (err: any) {
      set({ loadingUpdate: false, error: 'impossible de débloquer la compétence', badges })
    } finally {
      set({ loadingUpdate: false })
    }
  },
}))
