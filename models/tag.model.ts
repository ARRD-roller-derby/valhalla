import { ObjectId } from 'mongodb'
import { Schema, model, models } from 'mongoose'

export interface ITag {
  _id: ObjectId
  name: string
  type: string
  count: number
}

const TagSchema = new Schema<ITag>({
  name: String,
  type: String,
  count: Number,
})

export const Tag = models.tags || model('tags', TagSchema)
