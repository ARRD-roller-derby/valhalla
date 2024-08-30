import { Schema, model, models } from 'mongoose'

export interface IUserBadgeSchema {
  _id: string
  userId: string
  badgeId: string
  date: Date
}

const userBadgeSchema = new Schema<IUserBadgeSchema>({
  userId: String,
  badgeId: String,
  date: Date,
})

export const UserBadge = models.userBadges || model('user_badges', userBadgeSchema)
