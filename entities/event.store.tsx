import { IEvent, IParticipant } from '@/models'
import { ROLES } from '@/utils'
import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'
import { ReactNode, createContext, useContext } from 'react'
import { create } from 'zustand'

// TYPES --------------------------------------------------------------------
interface EventProviderProps {
  children: ReactNode
  event: IEvent
}

interface IStateEvents {
  events: IEvent[]
  loading: boolean
  loadingEvent: ObjectId | null
  error?: string
  currentDay?: dayjs.Dayjs
  participants: IParticipant[]
}

interface IGetEvents {
  getEvent: (id: ObjectId) => IEvent | undefined
  getEventForDay: (date: dayjs.Dayjs) => IEvent[]
  getEventForCurrentDay(): IEvent[] | undefined
}

interface ISetEvents {
  setEvent: (event: IEvent) => void
  setEvents: (events: any[]) => void
  findOne: (id: ObjectId) => Promise<void>
  fetchForCal: (month: number) => Promise<void>
  fetchForNext: () => Promise<void>
  fetchParticipation: (eventId: ObjectId) => Promise<void>
  spyParticipation(eventId: ObjectId): Promise<void>
  setCurrentDay: (day: dayjs.Dayjs) => void
  createEvent: (event: IEventForm) => Promise<void>
  changeMyParticipation: (eventId: ObjectId, participation: string) => Promise<void>
  cancel(eventId: ObjectId): Promise<void>
  del(eventId: ObjectId): Promise<void>
  socketEvt: (msg: any) => void
}

export interface IEventForm {
  title: string
  type: string
  description: any
  address?: string
  start: string
  end: string
  visibility: string
  recurrence?: {
    frequency: string
    count: number
  }
}

export const ROLES_CAN_CREATE_EVENT = [ROLES.bureau, ROLES.coach, ROLES.evenement]

export const EVENT_TYPES = [
  'Entraînement de derby',
  'Cours de patinage',
  'Assemblée générale',
  'Scrimmage',
  'Match',
  'Bootcamp',
  'En ligne',
  'Événement',
  'Autre',
]

export type TEventType = (typeof EVENT_TYPES)[number]

export type IEventStore = IStateEvents & IGetEvents & ISetEvents

// STORE --------------------------------------------------------------------
export const useEvents = create<IEventStore>((set, get) => ({
  events: [],
  loading: false,
  loadingEvent: null,
  participants: [],
  // GETTERS----------------------------------------------------------------
  getEvent(id) {
    const { events } = get()
    return events.find((event) => event._id === id)
  },
  getEventForDay(date) {
    const { events } = get()
    return events.filter((event) => dayjs(event.start).isSame(date, 'day'))
  },
  getEventForCurrentDay() {
    const { events, currentDay } = get()
    if (!currentDay) return
    return events.filter((event) => dayjs(event.start).isSame(currentDay, 'day'))
  },

  // SETTERS----------------------------------------------------------------
  setEvent(event) {
    set((state) => {
      const isExist = state.events.find((e) => e._id === event._id)
      if (!isExist) return { events: [...state.events, event] }
      const events = state.events.map((e) => (e._id === event._id ? event : e))
      return { events }
    })
  },
  setEvents(events) {
    set({ events })
  },
  setCurrentDay(day) {
    set({ currentDay: day })
  },
  socketEvt(msg) {
    const { setEvent } = get()
    if (!msg) return
    if (msg.delete) set((state) => ({ events: state.events.filter((e) => e._id !== msg.delete) }))
    if (msg.event) setEvent(msg.event)
  },
  // FETCHES----------------------------------------------------------------
  // utilisé pour une page unique, voir si on fait le fetch en SSR
  async findOne(id) {
    set({ loading: true })
    try {
      const res = await fetch(`/api/events/${id}`)
      const { event } = await res.json()
      set((state) => ({ events: [...state.events, event], loading: false }))
    } catch (err: any) {
      set({ loading: false, error: "impossible de récupérer l' événement" })
    }
  },
  async fetchForCal(month) {
    set({ loading: true })
    try {
      const res = await fetch('/api/events/month/' + month)
      const { events } = await res.json()
      set({ events, loading: false })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de récupérer les événements' })
    }
  },
  async fetchForNext() {
    set({ loading: true })
    try {
      const res = await fetch('/api/events/next')
      const { events } = await res.json()
      set({ events, loading: false })
    } catch (err: any) {
      set({ loading: false, error: 'impossible de récupérer les événements' })
    }
  },
  async fetchParticipation(eventId) {
    set({ loadingEvent: eventId })
    try {
      const res = await fetch(`/api/events/${eventId}/participants`)
      const { participants } = await res.json()
      set({ participants, loadingEvent: null })
    } catch (err: any) {
      set({ loadingEvent: null, error: 'impossible de récupérer les participants' })
    }
  },
  async spyParticipation(id) {
    set({ loadingEvent: id })
    try {
      const res = await fetch(`/api/events/${id}/spy`)
      const { participants } = await res.json()
      set({ participants, loadingEvent: null })
    } catch (err: any) {
      set({ loadingEvent: null, error: 'impossible de récupérer les participants' })
    }
  },

  //SAVE ----------------------------------------------------------------
  async createEvent(event) {
    set({ loading: true })
    try {
      const res = await fetch('/api/events/create', {
        method: 'POST',
        body: JSON.stringify(event),
      })
      const { events: newEvents } = await res.json()
      set((state) => ({ events: [...state.events, ...newEvents], loading: false }))
    } catch (err: any) {
      set({ loading: false, error: "impossible de créer l'événement" })
    }
  },
  async changeMyParticipation(eventId, participation) {
    const { events } = get()
    const event = events.find((e) => e._id === eventId)
    if (!event) return

    set({ loadingEvent: eventId })

    try {
      const res = await fetch('/api/events/participation', {
        method: 'POST',
        body: JSON.stringify({ participation, eventId }),
      })
      const { event } = await res.json()

      set((state) => {
        const events = state.events.map((e) => (e._id === event._id ? event : e))
        return { events, loadingEvent: null }
      })
    } catch (err: any) {
      set({ loadingEvent: null, error: "impossible de créer l'événement" })
    }
  },
  async cancel(eventId) {
    const { events } = get()
    const event = events.find((e) => e._id === eventId)
    if (!event) return

    set({ loadingEvent: eventId })

    try {
      const res = await fetch(`/api/events/${eventId}/cancel`, {
        method: 'PUT',
      })
      const { event } = await res.json()

      set((state) => {
        const events = state.events.map((e) => (e._id === event._id ? event : e))
        return { events, loadingEvent: null }
      })
    } catch (err: any) {
      set({ loadingEvent: null, error: "impossible de créer l'événement" })
    }
  },
  async del(eventId) {
    const { events } = get()
    const event = events.find((e) => e._id === eventId)
    if (!event) return

    set({ loadingEvent: eventId })

    try {
      const res = await fetch(`/api/events/${eventId}/delete`, {
        method: 'DELETE',
      })
      const { event } = await res.json()

      set((state) => {
        const events = state.events.filter((e) => e._id !== event._id)
        return { events, loadingEvent: null }
      })
    } catch (err: any) {
      set({ loadingEvent: null, error: "impossible de créer l'événement" })
    }
  },
}))

// CONTEXT ------------------------------------------------------------------
const EventCtx = createContext<IEvent>({} as IEvent)

export function EventProvider({ children, event }: EventProviderProps) {
  return <EventCtx.Provider value={event}>{children}</EventCtx.Provider>
}

// HOOKS --------------------------------------------------------------------
export function useEvent() {
  const ctx = useContext(EventCtx)
  if (!ctx) throw new Error('useEvent must be used within a EventProvider')
  return { event: ctx }
}
