// Bibliothèques externes
import { create } from 'zustand'

// Bibliothèques internes
import { ISkill, IUserSkill, TSkillCategory, TSkillLevel } from '@/models'
import { useContext, createContext } from 'react'
import { useSession } from 'next-auth/react'

// TYPES --------------------------------------------------------------------

interface SkillProviderProps {
  children: React.ReactNode
  skill: ISkill
}

export interface IMemberWithSkill {
  avatar: string
  username: string
  providerAccountId: string
  notAcquired: Date | null
  master: Date | null
  learned: Date | null
}

interface IGetSkill {
  loading: boolean
  loadingCreate: boolean
  loadingSkill: string | null
  loadingMember: boolean
  loadingUpdateUserLevel: boolean
  skills: ISkill[]
  error: string | null
  score: ISkillScore[]
  members: IMemberWithSkill[]
  getSkill: (id: string) => ISkill | undefined
  mySkill: (id: string, userId: string) => IUserSkill | undefined
  getMember: (providerAccountId: string) => IMemberWithSkill | undefined
}

interface IFetchSkill {
  fetchSkills: (category?: string) => Promise<void>
  fetchSkill: (id: string) => Promise<void>
  fetchSkillScore: (providerAccountId: string) => Promise<void>
  fetchSkillByMembers: (id: string) => Promise<void>
}

export interface ISkillCreate {
  name: string
  msp: boolean
  description: any
  category: string
  tags: string[]
}

interface ISetSkill {
  createSkill: (skill: ISkillCreate) => void
  updateSkill: (skill: ISkillCreate) => void
  setMembers: (members: IMemberWithSkill[]) => void
  del(skillId: string): Promise<void>
  socketEvt: (msg: any) => void
  updateSkillUserLevel: (skillId: string, providerAccountId: string, level: string) => Promise<void>
}

export interface ISkillScore {
  notAcquiredCount: number
  learnedCount: number
  masterCount: number
  category: TSkillCategory
  level: TSkillLevel
  total: number
}

export type ISkillStore = ISetSkill & IGetSkill & IFetchSkill

// STORE --------------------------------------------------------------------

export const useSkills = create<ISkillStore>((set, get) => ({
  //STATE --------------------------------------------------------------------

  loading: false,
  loadingCreate: false,
  loadingSkill: null,
  loadingMember: false,
  loadingUpdateUserLevel: false,
  skills: [],
  members: [],
  error: null,
  score: [],

  // GETTERS----------------------------------------------------------------
  getSkill(id) {
    return get().skills.find((skill) => skill._id === id)
  },
  mySkill(id, userId) {
    const skill = get().skills.find((skill) => skill._id === id)
    return skill?.users.find((user) => user.providerAccountId === userId)
  },
  getMember(providerAccountId) {
    return get().members.find((member) => member.providerAccountId === providerAccountId)
  },

  // FETCHERS----------------------------------------------------------------
  async fetchSkill(id) {
    set({ loading: true, error: null, skills: [] })
    try {
      const res = await fetch(`/api/skills/${id}`)
      const { skill } = await res.json()
      set((prev) => ({ skills: [...prev.skills, skill], loading: false }))
    } catch (err: any) {
      set({ loading: false, error: 'impossible de récupérer la compétence' })
    }
  },
  async fetchSkillByMembers(id) {
    set({ loadingMember: true, error: null })
    try {
      const res = await fetch(`/api/skills/${id}/members`)
      const { members } = await res.json()
      set({ members, loadingMember: false })
    } catch (err: any) {
      set({ loadingMember: false, error: 'impossible de récupérer la liste des membres' })
    }
  },
  async fetchSkills(category) {
    set({ loading: true, error: null, skills: [] })
    try {
      const res = await fetch(category ? `/api/skills/category/${category}` : '/api/skills')
      const { skills } = await res.json()
      set({ skills, loading: false })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de récupérer les compétences' })
    }
  },
  async fetchSkillScore(providerAccountId) {
    set({ loading: true, error: null, score: [] })
    try {
      const res = await fetch(`/api/skills/score/${providerAccountId}`)
      const { score } = await res.json()
      set({ score, loading: false })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de récupérer les compétences' })
    }
  },

  // SETTERS----------------------------------------------------------------

  socketEvt(msg) {
    if (!msg) return
    if (msg.delete) set((state) => ({ skills: state.skills.filter((e) => e._id !== msg.delete) }))
    if (msg.event) set((state) => ({ skills: [...state.skills, msg], loadingCreate: false }))
  },
  async createSkill(skill) {
    set({ loadingCreate: true, error: null })
    try {
      const res = await fetch('/api/skills/create', {
        method: 'POST',
        body: JSON.stringify(skill),
      })
      const { skill: newSkill } = await res.json()
      const currentCat = get().skills[0]?.category

      set((state) => ({
        skills: newSkill.category === currentCat ? [...state.skills, newSkill] : [...state.skills],
        loadingCreate: false,
      }))
    } catch (err: any) {
      set({ loadingCreate: false, error: 'impossible de créer la compétence' })
    }
  },
  async updateSkill(skill) {
    set({ loadingCreate: true, error: null })
    try {
      const res = await fetch('/api/skills/update', {
        method: 'PUT',
        body: JSON.stringify(skill),
      })
      const { skill: updatedSkill } = await res.json()

      set((state) => ({
        skills: state.skills.map((s) => (s._id === updatedSkill._id ? updatedSkill : s)),
        loadingCreate: false,
      }))
    } catch (err: any) {
      set({ loadingCreate: false, error: 'impossible de modifier la compétence' })
    }
  },
  async del(skillId) {
    const { skills } = get()
    const event = skills.find((e) => e._id === skillId)
    if (!event) return

    set({ loadingSkill: skillId })

    try {
      const res = await fetch(`/api/skills/${skillId}/delete`, {
        method: 'DELETE',
      })
      const { event } = await res.json()

      set((state) => {
        const skills = state.skills.filter((e) => e._id !== event._id)
        return { skills, loadingEvent: null }
      })
    } catch (err: any) {
      set({ loadingSkill: null, error: "impossible de créer l'événement" })
    }
  },
  async updateSkillUserLevel(skillId, providerAccountId, level) {
    set({ loadingUpdateUserLevel: true, error: null })
    try {
      const res = await fetch(`/api/skills/${skillId}/level`, {
        method: 'PUT',
        body: JSON.stringify({
          providerAccountId,
          level,
        }),
      })
      const { skill: updatedSkill } = await res.json()

      set((state) => ({
        loadingUpdateUserLevel: false,
        skills: state.skills.map((s) => (s._id === updatedSkill._id ? updatedSkill : s)),
        members: state.members.map((m) => {
          if (m.providerAccountId === providerAccountId) {
            const userSkill = updatedSkill.users.find((u: IUserSkill) => u.providerAccountId === providerAccountId)
            if (!userSkill) return m
            const { master, notAcquired, learned } = userSkill
            return {
              ...m,
              master,
              notAcquired,
              learned,
            }
          }
          return m
        }),
      }))
    } catch (err: any) {
      set({ loadingUpdateUserLevel: false, error: 'impossible de modifier le niveau' })
    }
  },
  setMembers(members) {
    set({ members })
  },
}))

// CONTEXT ------------------------------------------------------------------
const SkillCtx = createContext<ISkill>({} as ISkill)

export function SkillProvider({ children, skill }: SkillProviderProps) {
  return <SkillCtx.Provider value={skill}>{children}</SkillCtx.Provider>
}

// HOOKS --------------------------------------------------------------------
export function useSkill() {
  const ctx = useContext(SkillCtx)
  if (!ctx?._id) throw new Error('useSkill must be used within a SkillProvider')
  const { data: session } = useSession()
  const mySkill = useSkills().mySkill(ctx._id, session?.user?.providerAccountId || '')

  return { skill: ctx, mySkill }
}
