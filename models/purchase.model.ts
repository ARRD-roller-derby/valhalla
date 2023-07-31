import { ObjectId } from 'mongodb'
import { Schema, model, models } from 'mongoose'

export interface IPurchase {
  _id: ObjectId
  userId: ObjectId
  name: string
  price: number
  quantity: number
  createdAt: Date
}

const PurchaseSchema = new Schema<IPurchase>({
  userId: ObjectId,
  name: String,
  price: Number,
  quantity: Number,
  createdAt: Date,
})

export const Purchase = models.purchases || model('purchases', PurchaseSchema)
