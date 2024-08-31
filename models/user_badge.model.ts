import { Schema, model, models } from 'mongoose'

export interface IUserBadgeSchema {
  _id: string
  providerAccountId: string
  badgeId: string
  date: Date
}

const userBadgeSchema = new Schema<IUserBadgeSchema>({
  providerAccountId: String,
  badgeId: String,
  date: Date,
})

export const UserBadge = models.user_badges || model('user_badges', userBadgeSchema)
