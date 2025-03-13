// Bibliothèques externes
import { ReactNode, createContext, useContext } from 'react'
import { create } from 'zustand'
import { IBadge } from './badge.store'

// TYPES --------------------------------------------------------------------

export interface IDolibarrMember {
  first_subscription_date_start: number
  first_subscription_date_end: number
  first_subscription_date: number
  first_subscription_amount: string
  last_subscription_amount: string
  phone_perso?: string
  datefin?: number
  town?: string
  zip?: string
  address?: string
  type: string // type de souscription de licence
  birth?: string
  options_allergies: string
  options_derbyname: string
  options_nroster: string
  options_nlicence: string
  options_rgimealimentaire?: string
  gender: 'man' | 'woman' | 'other' | undefined
}

interface TRole {
  id: string
  name: string
  color: string
}
interface IMember extends IDolibarrMember {
  id: string
  username: string
  avatar: string
  providerAccountId: string
  roles: TRole[]
}

interface MemberProviderProps {
  children: ReactNode
  member: IMember
  badges: IBadge[]
}

interface IStateMembers {
  members: IMember[]
  badges: IBadge[]
  roles: TRole[]
  loading: boolean
  error?: string
}

interface IGetMembers {
  getMember: (providerAccountId: string) => IMember
}

interface IFetchMembers {
  fetchMembers: () => Promise<void>
  fetchMember: (providerAccountId: string) => Promise<void>
  fetchProfiles: () => Promise<void>
}

interface ISetMembers {}

export type IMemberStore = IStateMembers & IGetMembers & ISetMembers & IFetchMembers

// STORE --------------------------------------------------------------------
export const useMembers = create<IMemberStore>((set, get) => ({
  members: [],
  loading: false,
  roles: [],
  badges: [],

  // GETTERS----------------------------------------------------------------
  getMember(providerAccountId: string) {
    const { members } = get()
    return members.find((member) => member.providerAccountId === providerAccountId) as IMember
  },

  // FETCHES----------------------------------------------------------------
  async fetchMembers() {
    set({ loading: true, members: [] })
    try {
      const res = await fetch('/api/members')
      const { members } = await res.json()
      set(() => ({ members, loading: false }))
    } catch (err: any) {
      set({ loading: false, error: 'impossible de trouver les membres' })
    }
  },
  async fetchMember(providerAccountId: string) {
    set({ loading: true, members: [] })
    try {
      const res = await fetch(`/api/members/${providerAccountId}`)
      const { member, badges } = await res.json()
      set({
        members: [member],
        badges,
        loading: false,
      })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de trouve le membre' })
    }
  },
  async fetchProfiles() {
    set({ loading: true, roles: [] })
    try {
      const res = await fetch('/api/members/profiles')

      const { roles } = await res.json()
      set({ roles, loading: false })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de trouver les profils' })
    }
  },

  // SETTERS----------------------------------------------------------------
}))

// CONTEXT ------------------------------------------------------------------
const MemberCtx = createContext<{
  member: IMember
  badges: IBadge[]
}>({} as Pick<MemberProviderProps, 'member' | 'badges'>)

export function MemberProvider({ children, member, badges = [] }: MemberProviderProps) {
  return <MemberCtx.Provider value={{ member, badges }}>{children}</MemberCtx.Provider>
}

// HOOKS --------------------------------------------------------------------
export function useMember() {
  const ctx = useContext(MemberCtx)
  if (!ctx) throw new Error('useMember must be used within a MemberProvider')
  return { member: ctx.member, badges: ctx.badges }
}
