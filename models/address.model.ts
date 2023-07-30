import { ObjectId } from 'mongodb'
import { Schema, model, models } from 'mongoose'

export interface IAddress {
  _id: ObjectId
  lat: number
  lon: number
  city: string
  zipCode: string
  number: string
  street: string
  label: string
  updatedAt: Date
  // Count pour order en fonction du nombre de fois que l'adresse a été utilisée
  popularity: number
}

export const AddressSchema = new Schema<IAddress>({
  lat: Number,
  lon: Number,
  city: String,
  zipCode: String,
  number: String,
  street: String,
  label: String,
  popularity: Number,
  updatedAt: Date,
})

export const Address = models.addresses || model('addresses', AddressSchema)
