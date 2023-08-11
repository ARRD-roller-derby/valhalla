// Bibliothèques externes
import { create } from 'zustand'

// Bibliothèques internes
import { ITag } from '@/models'
import { useContext, createContext } from 'react'

// TYPES --------------------------------------------------------------------

interface TagProviderProps {
  children: React.ReactNode
  tag: ITag
}

interface IGetTag {
  loading: boolean
  loadingCreate: boolean
  tags: ITag[]
  error: string | null
}

interface IFetchTag {
  getTags: (type: string) => void
}

interface ISetTag {
  createTag: (Tag: ITag) => void
}

export type ITagStore = ISetTag & IGetTag & IFetchTag

// STORE --------------------------------------------------------------------

export const useTags = create<ITagStore>((set, get) => ({
  //STATE --------------------------------------------------------------------

  loading: false,
  loadingCreate: false,
  tags: [],
  error: null,

  // GETTERS----------------------------------------------------------------
  async getTags(type) {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/tags/${type}`)
      const { tags } = await res.json()
      set({ tags, loading: false })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de récupérer les tags' })
    }
  },

  // SETTERS----------------------------------------------------------------

  async createTag(Tag) {
    set({ loadingCreate: true, error: null })
    try {
      const res = await fetch('/api/tags/create', {
        method: 'POST',
        body: JSON.stringify(Tag),
      })
      const { Tags: newTags } = await res.json()
      set((state) => ({ Tags: [...state.tags, ...newTags], loadingCreate: false }))
    } catch (err: any) {
      set({ loadingCreate: false, error: 'impossible de créer la compétence' })
    }
  },
}))

// CONTEXT ------------------------------------------------------------------
const TagCtx = createContext<ITag>({} as ITag)

export function TagProvider({ children, tag }: TagProviderProps) {
  return <TagCtx.Provider value={tag}>{children}</TagCtx.Provider>
}

// HOOKS --------------------------------------------------------------------
export function useTag() {
  const ctx = useContext(TagCtx)
  if (!ctx) throw new Error('useTag must be used within a TagProvider')
  return { event: ctx }
}
