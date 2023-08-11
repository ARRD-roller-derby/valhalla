import { IWeatherHourly, IWeatherHourlyUnits } from '@/entities'
import { Schema, model, models } from 'mongoose'

export interface IWeather {
  lat: number
  lon: number
  timezone: string
  hourly: IWeatherHourly
  hourlyUnits: IWeatherHourlyUnits
  updatedAt?: Date
}

const WeatherSchema = new Schema<IWeather>({
  lat: Number,
  lon: Number,
  timezone: String,
  hourly: Object,
  hourlyUnits: Object,
  updatedAt: Date,
})

export const Weather = models.weathers || model('weathers', WeatherSchema)
