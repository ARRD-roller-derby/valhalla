import { ObjectId } from 'mongodb'
import { Schema, model, models } from 'mongoose'

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export type CardType = 'flashcard' | 'player'

export interface Player {
  name: string
  type: string
  cardio: number
  vitesse: number
  esquive: number
  assistance: number
  récupération: number
}

export interface Card {
  _id: ObjectId
  question?: string
  answers?: string[]
  img: string
  rarity: Rarity
  type: CardType
  cost: number
  owner: ObjectId | null
  player?: Player
}

const CardSchema = new Schema<Card>({
  question: String,
  answers: [String],
  img: String,
  rarity: String,
  type: String,
  cost: Number,
  owner: Schema.Types.ObjectId,
  player: {
    name: String,
    type: String,
    cardio: Number,
    vitesse: Number,
    esquive: Number,
    assistance: Number,
    récupération: Number,
  },
})

export const Card = models.cards || model('cards', CardSchema)
