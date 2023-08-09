// Bibliothèques externes
import { create } from 'zustand'

// Bibliothèques internes
import { ISkill, TSkillCategory, TSkillLevel } from '@/models'
import { useContext, createContext } from 'react'

// TYPES --------------------------------------------------------------------

interface SkillProviderProps {
  children: React.ReactNode
  skill: ISkill
}

interface IGetSkill {
  loading: boolean
  loadingCreate: boolean
  skills: ISkill[]
  error: string | null
  score: ISkillScore[]
}

interface IFetchSkill {
  fetchSkills: (category?: string) => Promise<void>
  fetchSkillScore: () => Promise<void>
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
  skills: [],
  error: null,
  score: [],

  // GETTERS----------------------------------------------------------------

  // FETCHERS----------------------------------------------------------------
  async fetchSkills(category) {
    set({ loading: true, error: null, skills: [] })
    try {
      const res = await fetch(category ? `/api/skills/${category}` : '/api/skills')
      const { skills } = await res.json()
      set({ skills, loading: false })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de récupérer les compétences' })
    }
  },
  async fetchSkillScore() {
    set({ loading: true, error: null, score: [] })
    try {
      const res = await fetch('/api/skills/score')
      const { score } = await res.json()
      set({ score, loading: false })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de récupérer les compétences' })
    }
  },

  // SETTERS----------------------------------------------------------------

  async createSkill(skill) {
    set({ loadingCreate: true, error: null })
    try {
      const res = await fetch('/api/skills/create', {
        method: 'POST',
        body: JSON.stringify(skill),
      })
      const { skill: newSkill } = await res.json()
      set((state) => ({ skills: [...state.skills, newSkill], loadingCreate: false }))
    } catch (err: any) {
      set({ loadingCreate: false, error: 'impossible de créer la compétence' })
    }
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
  if (!ctx) throw new Error('useSkill must be used within a SkillProvider')

  return { skill: ctx }
}
