import { Question } from '@/models'
import { create } from 'zustand'

// TYPES --------------------------------------------------------------------

interface StateQuestions {
  loading: boolean
  questions: Question[]
  error: string | null
}

interface GetQuestions {
  getQuestions: () => Promise<void>
}

interface SetQuestions {
  createQuestion: (question: Question) => Promise<void>
  updateQuestion: (question: Question) => Promise<void>
  setError: (error: string) => void
}

export type QuestionStore = StateQuestions & GetQuestions & SetQuestions

// STORE --------------------------------------------------------------------

export const useQuestions = create<QuestionStore>((set, get) => ({
  //STATE --------------------------------------------------------------------
  loading: false,
  questions: [],
  error: null,

  // GETTERS----------------------------------------------------------------
  async getQuestions() {
    set({ loading: true })
    const res = await fetch(`/api/questions`)
    const questions = await res.json()
    set({ questions, loading: false })
  },

  // SETTERS----------------------------------------------------------------
  setError(error: string) {
    set({ error })
  },
  async createQuestion(question: Question) {
    set({ loading: true })

    try {
      await fetch(`/api/questions/create`, {
        method: 'POST',
        body: JSON.stringify(question),
      })
      get().getQuestions()
    } catch (error: any) {
      set({ error: error?.message as string })
    } finally {
      set({ loading: false })
    }
  },

  async updateQuestion(question: Question) {
    set({ loading: true })

    try {
      await fetch(`/api/questions/update`, {
        method: 'PUT',
        body: JSON.stringify(question),
      })
      get().getQuestions()
    } catch (error: any) {
      set({ error: error?.message as string })
    } finally {
      set({ loading: false })
    }
  },
}))
