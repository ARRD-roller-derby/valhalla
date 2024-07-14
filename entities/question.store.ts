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
  createQuestion: (question: Question & { file?: any; delImg?: boolean }, type: 'create' | 'update') => Promise<void>
  deleteQuestion: (id: string) => Promise<void>
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
  async createQuestion(question: Question & { file?: any; delImg?: boolean }, type: 'create' | 'update') {
    set({ loading: true })
    const form = new FormData()

    if (type === 'update') {
      // @ts-ignore
      form.append('_id', question._id)
    }

    form.append('question', question.question)
    form.append('status', question.status)

    if (question.file) {
      form.append('file', question.file)
      form.append('name', question.file.name)
      form.append('type', question.file.type)
      form.append('size', question.file.size.toString())
    }

    if (question.delImg) form.append('delImg', 'true')

    form.append('answers', JSON.stringify(question.answers))
    try {
      await fetch(`/api/questions/${type}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: form,
      })
      get().getQuestions()
    } catch (error: any) {
      set({ error: error?.message as string })
    } finally {
      set({ loading: false })
    }
  },
  async deleteQuestion(id: string) {
    set({ loading: true })
    try {
      await fetch(`/api/questions/delete`, {
        method: 'POST',

        body: JSON.stringify({ _id: id }),
      })
      get().getQuestions()
    } catch (error: any) {
      set({ error: error?.message as string })
    } finally {
      set({ loading: false })
    }
  },
}))
