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
  getForecast: (lat: number, lon: number) => Promise<IForecast>
}

interface ISetWeather {}

export type IWeatherStore = IStateWeather & IGetWeather & ISetWeather

// STORE --------------------------------------------------------------------

export const useWeather = create<IWeatherStore>((set, get) => ({
  //STATE --------------------------------------------------------------------
  loading: false,
  forecasts: [],
  // GETTERS----------------------------------------------------------------
  async getForecast(lat, lon) {
    set({ loading: true })
    //je recherche d'abord si j'ai déjà les données dans le store
    const { forecasts } = get()

    const forecast = forecasts.find((f) => f.lat === lat && f.lon === lon)

    if (forecast) {
      set({ loading: false })
      return forecast
    }
    const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString() })
    const res = await fetch(`/api/weather?${params.toString()}`)
    const resJson = await res.json()
    set({ forecasts: [...forecasts, resJson], loading: false })
    return resJson
  },

  // SETTERS----------------------------------------------------------------
}))
