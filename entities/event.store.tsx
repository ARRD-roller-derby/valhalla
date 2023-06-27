import { IEvent } from '@/models'
import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'
import { ReactNode, createContext } from 'react'
import { create } from 'zustand'

// TYPES --------------------------------------------------------------------
interface EventProviderProps {
  children: ReactNode
  event: IEvent
}

interface IStateEvents {
  events: IEvent[]
  loading: boolean
  error?: string
  currentDay?: dayjs.Dayjs
}

interface IGetEvents {
  getEvent: (id: ObjectId) => IEvent | undefined
  getEventForDay: (date: dayjs.Dayjs) => IEvent[]
}

interface ISetEvents {
  setEvents: (events: any[]) => void
  findOne: (id: ObjectId) => Promise<void>
  fetchForCal: (month: number) => Promise<void>
  setCurrentDay: (day: dayjs.Dayjs) => void
}

export const ROLES_CAN_CREATE_EVENT = ['bureau', 'coach', 'Evénements']

export type IEventStore = IStateEvents & IGetEvents & ISetEvents

// STORE --------------------------------------------------------------------
export const useEvents = create<IEventStore>((set, get) => ({
  events: [],
  loading: false,
  // GETTERS----------------------------------------------------------------
  getEvent: (id) => {
    const { events } = get()
    return events.find((event) => event._id === id)
  },
  getEventForDay: (date) => {
    const { events } = get()
    return events.filter((event) => dayjs(event.start).isSame(date, 'day'))
  },
  // SETTERS----------------------------------------------------------------
  setEvents: (events) => set({ events }),
  setCurrentDay: (day) => set({ currentDay: day }),
  // FETCHES----------------------------------------------------------------
  // utilisé pour une page unique, voir si on fait le fetch en SSR
  findOne: async (id) => {
    set({ loading: true })
    const res = await fetch(`/api/event/${id}`)
    const event = await res.json()
    set((state) => ({ events: [...state.events, event], looading: false }))
  },
  fetchForCal: async (month) => {
    set({ loading: true })
    try {
      const res = await fetch('/api/events/month/' + month)
      const { events } = await res.json()
      set({ events, loading: false })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de récupérer les événements' })
    }
  },
}))

// CONTEXT ------------------------------------------------------------------
const EventCtx = createContext<IEvent>({} as IEvent)

export function EventProvider({ children, event }: EventProviderProps) {
  return <EventCtx.Provider value={event}>{children}</EventCtx.Provider>
}
