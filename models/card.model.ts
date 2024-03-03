import { ObjectId } from 'mongodb'
import { Schema, model, models } from 'mongoose'

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export type CardType = 'flashcard' | 'player'

export interface Player {
  name: string
  type: string
  stamina: number
  speed: number
  dodge: number
  block: number
  assistance: number
  recovery: number
}

export type Frequency = 'daily' | '3days' | 'weekly' | 'monthly' | 'trimester' | 'semester' | 'yearly'

export const FrequencyEnum: Frequency[] = ['daily', '3days', 'weekly', 'monthly', 'trimester', 'semester', 'yearly']

export type FlashCard = {
  frequency: Frequency
  lastRevision: Date
}

export interface Answer {
  type: 'good' | 'bad'
  answer: string
  _id: ObjectId
}
export interface Card {
  _id: ObjectId
  question?: string
  answers?: Answer[]
  img: string
  rarity: Rarity
  type: CardType
  cost: number
  flash?: FlashCard
  owner: ObjectId | null
  player?: Player
}

const PlayerSchema = new Schema<Player>({
  name: String,
  type: String,
  stamina: Number,
  speed: Number,
  dodge: Number,
  block: Number,
  assistance: Number,
  recovery: Number,
})

const FlashSchema = new Schema<FlashCard>({
  lastRevision: Date,
  frequency: String,
})

const answerSchema = new Schema<Answer>({
  type: String,
  answer: String,
})

const CardSchema = new Schema<Card>({
  question: String,
  answers: [answerSchema],
  img: String,
  rarity: String,
  type: String,
  cost: Number,
  owner: Schema.Types.ObjectId,

  flash: FlashSchema,
  player: PlayerSchema,
})

export const Card = models.cards || model('cards', CardSchema)
