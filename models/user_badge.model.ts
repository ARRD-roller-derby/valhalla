import { Schema, model, models } from 'mongoose'

export interface IUserBadgeSchema {
  _id: string
  providerAccountId: string
  badgeId: string
  unLockDate: Date
  announcementDate: Date | null
}

const userBadgeSchema = new Schema<IUserBadgeSchema>({
  providerAccountId: String,
  badgeId: String,
  unLockDate: Date,
  announcementDate: Date,
})

export const UserBadge = models.user_badges || model('user_badges', userBadgeSchema)
