import { Schema, model, models } from 'mongoose'

export interface IUserBadgeSchema {
  _id: string
  providerAccountId: string
  badgeId: string
  unLockDate: Date
  hasViewed: boolean
}

const userBadgeSchema = new Schema<IUserBadgeSchema>({
  providerAccountId: String,
  badgeId: String,
  unLockDate: Date,
  hasViewed: Boolean,
})

export const UserBadge = models.user_badges || model('user_badges', userBadgeSchema)
