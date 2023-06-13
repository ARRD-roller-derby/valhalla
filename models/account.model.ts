import { ObjectId } from 'mongodb'
import { Schema, model, models } from 'mongoose'

export interface IAccount {
  provider: string
  type: string
  providerAccountId: string
  access_token: string
  expires_at: Date
  refresh_token: string
  token_type: string
  userId: ObjectId
  expires: Date
}

const AccountSchema = new Schema<IAccount>({
  provider: String,
  type: String,
  providerAccountId: String,
  access_token: String,
  expires_at: Date,
  refresh_token: String,
  token_type: String,
  userId: ObjectId,
  expires: Date,
})

export const Account = models.accounts || model('accounts', AccountSchema)
