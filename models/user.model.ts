import { Schema, model, models } from 'mongoose'
export enum Pronoun {
  ELLE = 'elle',
  IL = 'il',
  IEL = 'iel',
}

export interface UserInterface {
  _id: string
  providerAccountId: string
  wallet: number
  name: string
  derbyName: string
  numRoster: number
  mst: boolean
  msp: boolean
  dailyContestAvgTime: number
  dailyContestAvgAccuracy: number
}

const userSchema = new Schema<UserInterface>({
  providerAccountId: String,
  wallet: Number,
  name: String,
  derbyName: String,
  numRoster: Number,
})

export const User = models.users || model('users', userSchema)
