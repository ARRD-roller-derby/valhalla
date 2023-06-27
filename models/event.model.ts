import { ObjectId } from 'mongodb'
import { Schema, model, models } from 'mongoose'
import { AddressSchema, IAddress } from '@/models'

export enum EEventType {
  training = 'training',
  generalAssembly = 'generalAssembly',
  scrimmage = 'scrimmage',
  match = 'match',
  bootcamp = 'bootcamp',
  online = 'online',
  event = 'event',
  other = 'other',
}

export interface IParticipant {
  _id: ObjectId
  userId: string
  status: 'present' | 'absent' | 'pending'
  updatedAt: Date
  type: string
  guestsNumber: number
}

export interface IEvent {
  _id: ObjectId
  visibility: 'public' | 'member' | 'admin'
  cancelled: boolean
  recurrenceId: string
  type: EEventType
  description?: string
  title?: string
  start: Date
  end: Date
  participants: IParticipant[]
  address?: IAddress
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
  guestsNumber: Number,
})

const EventSchema = new Schema<IEvent>({
  visibility: String,
  cancelled: Boolean,
  recurrenceId: String,
  type: String,
  description: String,
  title: String,
  start: Date,
  end: Date,
  participants: [ParticipantSchema],
  address: AddressSchema,
  leader: {
    userId: String,
    name: String,
  },
})

export const Event = models.events || model('events', EventSchema)
