import { IWeatherHourly, IWeatherHourlyUnits } from '@/entities'
import { Schema, model, models } from 'mongoose'

export interface IWeather {
  lat: string
  lon: string
  timezone: string
  hourly: IWeatherHourly
  hourlyUnits: IWeatherHourlyUnits
  updatedAt?: Date
}

const WeatherSchema = new Schema<IWeather>({
  lat: String,
  lon: String,
  timezone: String,
  hourly: Object,
  hourlyUnits: Object,
  updatedAt: Date,
})

export const Weather = models.weathers || model('weathers', WeatherSchema)
