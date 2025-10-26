import { Schema, model, models } from 'mongoose'
export enum Pronoun {
  ELLE = 'elle',
  IL = 'il',
  IEL = 'iel',
}

export type TRole = {
  id: string
  name: string
  color: number
}

export interface IUser {
  _id: string
  id: string
  providerAccountId: string
  name: string
  derbyName: string
  numRoster: number
  mst: boolean
  msp: boolean
  image: string
  roles: TRole[]
  type: string
  licence_number: string
  roster_number: string
  derby_name: string
  allergies: string
  diet: string
  phone: string
  town: string
  zip: string
  address: string
  birth: string
  gender: string
}

const RoleSchema = new Schema<TRole>({
  id: String,
  name: String,
  color: Number,
})

const userSchema = new Schema<IUser>({
  providerAccountId: String,
  name: String,
  derbyName: String,
  numRoster: Number,
  mst: Boolean,
  msp: Boolean,
  roles: [RoleSchema],
})

export const User = models.users || model('users', userSchema)
