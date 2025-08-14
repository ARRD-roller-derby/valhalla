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

export type TEventTypeFilter = 'tous' | 'derby' | 'patin' | 'pieds'

interface IStateEvents {
  events: IEvent[]
  loading: boolean
  loadingExport: boolean
  loadingEvent: ObjectId | null
  error?: string
  currentDay?: dayjs.Dayjs
  participants: IParticipant[]
  eventsTypesFilters: TEventTypeFilter[]
}

interface IGetEvents {
  getEvent: (id: ObjectId) => IEvent | undefined
  getEventForDay: (date: dayjs.Dayjs) => IEvent[]
  getEventForCurrentDay(): IEvent[] | undefined
  eventFilter: (event: IEvent) => boolean
}

interface ISetEvents {
  setEvent: (event: IEvent) => void
  setEvents: (events: any[]) => void
  findOne: (id: ObjectId) => Promise<void>
  fetchForCal: (month: number, year: number) => Promise<void>
  fetchForNext: () => Promise<void>
  fetchParticipation: (eventId: ObjectId) => Promise<void>
  syncParticipation: (eventId: ObjectId) => Promise<void>
  setCurrentDay: (day: dayjs.Dayjs) => void
  createEvent: (event: IEventForm) => Promise<void>
  updateEvent: (id: ObjectId, event: IEventForm) => Promise<void>
  changeMyParticipation: (eventId: ObjectId, participation: string) => Promise<void>
  changeMyParticipationStatus: (eventId: ObjectId, status: 'confirm' | 'maybe') => Promise<void>
  cancel(eventId: ObjectId): Promise<void>
  del(eventId: ObjectId): Promise<void>
  socketEvt: (msg: any) => void
  exportEventSkills: (eventId: ObjectId) => Promise<string>
  exportEventsIcs: () => Promise<string>
  setEventsTypesFilters: (filters: TEventTypeFilter[]) => void
}

export interface IEventForm {
  title: string
  type: string
  description: any
  descriptionPublic: any
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
  'Randonnée / Balade',
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
  loadingExport: false,
  loadingEvent: null,
  participants: [],
  eventsTypesFilters: ['tous'],
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
  eventFilter(event) {
    const { eventsTypesFilters } = get()
    if (eventsTypesFilters.includes('tous')) return true
    if (eventsTypesFilters.includes('patin') && event.type.match(/patin|balade/i)) return true
    if (eventsTypesFilters.includes('derby') && event.type.match(/derby|scrimmage|match|bootcamp/i)) return true
    if (eventsTypesFilters.includes('pieds') && !event.type.match(/derby|scrimmage|match|bootcamp|patin|balade/i))
      return true
    return false
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
  setEventsTypesFilters(filters) {
    set({ eventsTypesFilters: filters })
  },
  // FETCHES----------------------------------------------------------------
  // utilisé pour une page unique, voir si on fait le fetch en SSR
  async findOne(id) {
    set({ loading: true })
    try {
      const res = await fetch(`/api/events/${id}`)
      const { event } = await res.json()
      set((state) => ({
        events: [...state.events.filter((e) => e._id !== id), event],
        loading: false,
      }))
    } catch (err: any) {
      set({ loading: false, error: "impossible de récupérer l' événement" })
    }
  },

  async exportEventSkills(eventId) {
    set({ loadingExport: true })
    try {
      const res = await fetch(`/api/events/${eventId}/export_skills`)
      const { csv } = await res.json()
      return csv
    } catch (err: any) {
      set({ loadingExport: false, error: "impossible de récupérer l' événement" })
    }
  },
  async exportEventsIcs() {
    set({ loadingExport: true })
    try {
      const res = await fetch(`/api/events/export`)
      const { ics } = await res.json()
      return ics
    } catch (err: any) {
      set({ loadingExport: false, error: "impossible de récupérer l' événement" })
    }
  },
  async fetchForCal(month, year) {
    set({ loading: true })
    try {
      const res = await fetch('/api/events/month/' + month + '_' + year)
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
    set({ loadingEvent: eventId, participants: [], error: undefined })
    try {
      const res = await fetch(`/api/events/${eventId}/participants`)
      const { participants } = await res.json()
      set({
        participants,
        loadingEvent: null,
        events: get().events.map((e) => (e._id === eventId ? { ...e, participants } : e)),
      })
    } catch (err: any) {
      set({ loadingEvent: null, error: 'impossible de récupérer les participants' })
    }
  },
  async syncParticipation(id) {
    try {
      const res = await fetch(`/api/events/${id}/participants`)
      const { participants } = await res.json()
      set({ participants, events: get().events.map((e) => (e._id === id ? { ...e, participants } : e)) })
    } catch (err: any) {
      console.log(err)
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
  async updateEvent(id, event) {
    set({ loading: true })
    try {
      const res = await fetch(`/api/events/${id.toString()}/update`, {
        method: 'PUT',
        body: JSON.stringify(event),
      })
      const { event: evt } = await res.json()
      set((state) => ({
        events: [...state.events.filter((e) => e._id !== id), evt],
        loading: false,
      }))
    } catch (err: any) {
      set({ loading: false, error: "impossible de créer l'événement" })
    }
  },
  async changeMyParticipation(eventId, participation) {
    const { events } = get()
    const event = events.find((e) => e._id === eventId)
    if (!event) return

    set({ loadingEvent: eventId, error: undefined })

    try {
      const res = await fetch('/api/events/participation', {
        method: 'POST',
        body: JSON.stringify({ participation, eventId }),
      })
      const { event, participant } = await res.json()

      set((state) => {
        const events = state.events.map((e) => (e._id === event._id ? event : e))
        const participants = state.participants.map((p) => (p._id === participant._id ? participant : p))
        return { events, participants, loadingEvent: null }
      })
    } catch (err: any) {
      set({ loadingEvent: null, error: "impossible de créer l'événement" })
    }
  },
  async changeMyParticipationStatus(eventId, status) {
    const { events } = get()
    const event = events.find((e) => e._id === eventId)
    if (!event) return

    set({ loadingEvent: eventId, error: undefined })

    try {
      const res = await fetch('/api/events/participation-status', {
        method: 'POST',
        body: JSON.stringify({ status, eventId }),
      })
      const { event, participant } = await res.json()

      set((state) => {
        const events = state.events.map((e) => (e._id === event._id ? event : e))
        const participants = state.participants.map((p) => (p._id === participant._id ? participant : p))
        return { events, participants, loadingEvent: null }
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
