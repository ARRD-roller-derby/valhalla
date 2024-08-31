import { Schema, model, models } from 'mongoose'

export type IBadgeMedia = {
  url: string
  type: string
  name: string
}

const BadgeMedia = new Schema<IBadgeMedia>({
  url: String,
  type: String,
  name: String,
})

export interface IBadgeSchema {
  _id: string
  date: Date
  name: string
  tags: string[]
  type: 'derby' | 'patins'
  level: 'bronze' | 'argent' | 'or'
  medias: IBadgeMedia[]
  description: Object
  isProgressive: boolean
}

const BadgeSchema = new Schema<IBadgeSchema>({
  date: Date,
  name: String,
  tags: [String],
  type: String,
  level: String,
  medias: [BadgeMedia],
  description: Object,
  isProgressive: Boolean,
})

export const Badge = models.badges || model('badges', BadgeSchema)
