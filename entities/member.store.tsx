// Bibliothèques externes
import { ReactNode, createContext, useContext } from 'react'
import { create } from 'zustand'

// TYPES --------------------------------------------------------------------
interface IMember {
  id: string
  username: string
  avatar: string
  roles: {
    id: string
    name: string
    color: string
  }[]
}

interface MemberProviderProps {
  children: ReactNode
  member: IMember
}

interface IStateMembers {
  members: IMember[]
  loading: boolean
  error?: string
}

interface IGetMembers {
  getMembers: () => Promise<void>
}

interface ISetMembers {}

export type IMemberStore = IStateMembers & IGetMembers & ISetMembers

// STORE --------------------------------------------------------------------
export const useMembers = create<IMemberStore>((set, get) => ({
  members: [],
  loading: false,

  // GETTERS----------------------------------------------------------------
  async getMembers() {
    set({ loading: true, members: [] })
    try {
      const res = await fetch('/api/members')
      const { members } = await res.json()
      set(() => ({ members, loading: false }))
    } catch (err: any) {
      set({ loading: false, error: "impossible de créer l'événement" })
    }
  },

  // SETTERS----------------------------------------------------------------

  // FETCHES----------------------------------------------------------------
}))

// CONTEXT ------------------------------------------------------------------
const MemberCtx = createContext<IMember>({} as IMember)

export function MemberProvider({ children, member }: MemberProviderProps) {
  return <MemberCtx.Provider value={member}>{children}</MemberCtx.Provider>
}

// HOOKS --------------------------------------------------------------------
export function useMember() {
  const ctx = useContext(MemberCtx)
  if (!ctx) throw new Error('useMember must be used within a MemberProvider')
  return { member: ctx }
}
