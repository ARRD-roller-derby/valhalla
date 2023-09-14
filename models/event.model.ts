import { ObjectId } from 'mongodb'
import { Schema, model, models } from 'mongoose'

export enum EEventType {
  derbyTraining = 'Entraînement de derby',
  skateTraining = 'Cours de patinage',
  generalAssembly = 'Assemblée générale',
  ride = 'Randonnée / Balade',
  scrimmage = 'Scrimmage',
  match = 'Match',
  bootcamp = 'Bootcamp',
  online = 'En ligne',
  event = 'Événement',
  other = 'Autre',
}

export type TParticipantStatus = 'présent' | 'absent' | 'à confirmer'

export interface IParticipant {
  _id: ObjectId
  userId: string
  name: string
  status: TParticipantStatus
  updatedAt: Date
  type: string
  guestsNumber: number
}

export interface IEvent {
  _id: ObjectId
  visibility: 'public' | 'membre' | 'admin' | 'bureau'
  cancelled: boolean
  recurrenceId?: string
  type: EEventType
  description?: Object
  title?: string
  start: Date
  end: Date
  participants: IParticipant[]
  address?: {
    label: string
    lat: number
    lon: number
  }
  leader?: {
    userId: string
    name: string
  }
}

const ParticipantSchema = new Schema<IParticipant>({
  userId: String,
  status: String,
  updatedAt: Date,
  type: String,
  name: String,
  guestsNumber: Number,
})

const EventSchema = new Schema<IEvent>({
  visibility: String,
  cancelled: Boolean,
  recurrenceId: String,
  type: String,
  description: Object,
  title: String,
  start: Date,
  end: Date,
  participants: [ParticipantSchema],
  address: {
    label: String,
    lat: Number,
    lon: Number,
  },
  leader: {
    userId: String,
    name: String,
  },
})

export const Event = models.events || model('events', EventSchema)
