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

export interface ICarpooling {
  _id: ObjectId
  messageId: string
  participants: {
    userId: string
    name: string
    status: 'leader' | 'confirmed' | 'pending'
    updatedAt: Date
  }[]
  address: {
    label: string
    lat: number
    lon: number
  }
  date: Date
  places: number
  updatedAt: Date
  name: string
}

export interface IEvent {
  _id: ObjectId
  visibility: string
  cancelled: boolean
  recurrenceId?: string
  type: EEventType
  description?: Object
  descriptionPublic?: Object
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
  carpooling?: ICarpooling
}

const ParticipantSchema = new Schema<IParticipant>({
  userId: String,
  status: String,
  updatedAt: Date,
  type: String,
  name: String,
  guestsNumber: Number,
})

const CarpoolingSchema = new Schema<ICarpooling>({
  participants: [
    {
      userId: String,
      name: String,
      status: String,
      updatedAt: Date,
    },
  ],
  address: {
    label: String,
    lat: Number,
    lon: Number,
  },
  date: Date,
  places: Number,
  name: String,
  updatedAt: Date,
  messageId: String,
})

const EventSchema = new Schema<IEvent>({
  visibility: String,
  cancelled: Boolean,
  recurrenceId: String,
  type: String,
  description: Object,
  descriptionPublic: Object,
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
  carpooling: [CarpoolingSchema],
})

export const Event = models.events || model('events', EventSchema)
