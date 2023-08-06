import { Schema, model, models } from 'mongoose'
import { ITag, Tag } from './tag.model'

interface ISkillMedia {
  type: 'image' | 'video'
  url: string
}

type TSkillCategory = 'derby' | 'patinage'
type TSkillLevel = 'base' | 'intermédiaire' | 'avancé' | 'maîtrise'

interface IUserSkill {
  userId: string
  notAcquired: Date | null
  learned: Date | null
  master: Date | null
}

// On garde la date ou on l'efface pour pouvoir faire des stats sur les skills
const UserSkillsSchema = new Schema<IUserSkill>({
  userId: String,
  notAcquired: Date,
  learned: Date,
  master: Date,
})

export interface ISkill {
  _id: string
  name: string
  description: Object
  category: TSkillCategory
  level: TSkillLevel
  tags: string[]
  msp: boolean
  users: IUserSkill[]
  media?: ISkillMedia[]
}

const skillSchema = new Schema<ISkill>({
  name: String,
  description: Object,
  category: String,
  level: String,
  tags: [String],
  msp: Boolean,
  users: [UserSkillsSchema],
  media: [
    {
      type: String,
      url: String,
    },
  ],
})

export const Skill = models.skills || model('skills', skillSchema)
