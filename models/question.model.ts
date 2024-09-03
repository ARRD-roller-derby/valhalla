import { ObjectId } from 'mongodb'
import { Schema, model, models } from 'mongoose'

export interface Question {
  _id?: ObjectId
  question: string
  answers: IAnswer[]
  img: string
  status: 'published' | 'draft'
}

export interface IAnswer {
  _id?: ObjectId
  type: string
  answer: string
}

export interface Answer {
  type: 'good' | 'bad'
  answer: string
  _id: ObjectId
}

const Answer = new Schema({
  type: String,
  answer: String,
})

export const Questions =
  models.questions ||
  model(
    'questions',
    new Schema({
      status: String,
      question: String,
      answers: [Answer],
      img: String,
    })
  )

const QuestionSchema = new Schema<Question>({
  question: String,
  answers: [Answer],
  img: String,
})

export const Question = models.questions || model('questions', QuestionSchema)
