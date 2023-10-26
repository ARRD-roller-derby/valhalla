import { create } from 'zustand'

// TYPES --------------------------------------------------------------------

export interface IWeatherHourly {
  time: string[]
  apparent_temperature: number[] // en °C
  temperature_2m: number[] // en °C
  precipitation_probability: number[] // en %
  precipitation: number[] // en mm
  rain: number[] // en mm
  snowfall: number[] // en cm
  is_day: boolean[]
}

export interface IWeatherHourlyUnits {
  time: string
  apparent_temperature: string
  temperature_2m: string
  precipitation_probability: string
  precipitation: string
  rain: string
  snowfall: string
}

export interface IForecast {
  lat: number
  lon: number
  timezone: string
  hourly: IWeatherHourly
  hourlyUnits: IWeatherHourlyUnits
}

interface IStateWeather {
  loading: boolean
  forecasts: IForecast[]
}

interface IGetWeather {
  getForecasts: () => Promise<IForecast[]>
  getForecast: (lat: number, lon: number) => IForecast | undefined
}

interface ISetWeather {}

export type IWeatherStore = IStateWeather & IGetWeather & ISetWeather

// STORE --------------------------------------------------------------------

export const useWeather = create<IWeatherStore>((set, get) => ({
  //STATE --------------------------------------------------------------------
  loading: false,
  forecasts: [],
  // GETTERS----------------------------------------------------------------
  async getForecasts() {
    set({ loading: true })
    const res = await fetch('/api/weather')
    const resJson = await res.json()
    set({ forecasts: resJson.forecasts, loading: false })
    return resJson.forecasts
  },
  getForecast(lat, lon) {
    console.log('getForecast', lat, lon)
    const { forecasts } = get()
    return forecasts.find((f) => f.lat === lat && f.lon === lon)
  },

  // SETTERS----------------------------------------------------------------
}))
