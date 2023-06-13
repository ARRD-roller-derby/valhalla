import { MONGO_URI } from '@/utils/constants'
import mongoose from 'mongoose'

const connectMongo = async () => mongoose.connect(MONGO_URI)

declare global {
  var MongoDb: any | undefined
  var mongo: any | undefined
}

export const MongoDb = global.mongo || connectMongo

if (process.env.NODE_ENV !== 'production') MongoDb.mongo = connectMongo
