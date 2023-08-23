// Bibliothèques externes
import { useEffect, useState } from 'react'

// Bibliothèques internes
import { useEvent } from '@/entities'
import { IWeatherHourlyUnits, useWeather } from '@/entities'
import dayjs from 'dayjs'
import { dc } from '@/utils'
import { MoonIcon, RainIcon, SnowFlakeIcon, SunIcon } from '@/ui'

interface IForecastWidget {
  apparent_temperature: number
  temperature_2m: number
  precipitation_probability: number
  precipitation: number
  rain: number
  snowfall: number
  is_day: boolean
  hourlyUnits: IWeatherHourlyUnits
}

export function WeatherWidget() {
  // store
  const { event } = useEvent()
  const { getForecast } = useWeather()

  // state
  const [forecast, setForecast] = useState<IForecastWidget | null>(null)

  // effects
  useEffect(() => {
    handleForecast()
  }, [])

  const handleForecast = () => {
    if (!event || !event?.address) return

    const { lon, lat } = event.address
    if (!lon || !lat) return
    const dateFormatted = dayjs(event.start)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .format('YYYY-MM-DDTHH:00')

    const forecastSt = getForecast(lon, lat)
    if (!forecastSt) return
    const idx = forecastSt.hourly.time.findIndex((h: string) => h === dateFormatted)

    if (idx === -1) return
    const { apparent_temperature, temperature_2m, precipitation_probability, precipitation, rain, snowfall, is_day } =
      forecastSt.hourly
    const forecastForEvent: IForecastWidget = {
      apparent_temperature: apparent_temperature[idx],
      temperature_2m: temperature_2m[idx],
      precipitation_probability: precipitation_probability[idx],
      precipitation: precipitation[idx],
      rain: rain[idx],
      snowfall: snowfall[idx],
      is_day: is_day[idx],
      hourlyUnits: forecastSt.hourlyUnits,
    }
    setForecast(forecastForEvent)
  }

  if (!forecast) return null
  return (
    <div className="flex items-center justify-center gap-1 rounded border border-arrd-border p-1">
      {!forecast.is_day ? <MoonIcon className="fill-arrd-highlight" /> : <></>}
      {forecast.precipitation === 0 && forecast.precipitation_probability < 45 && forecast.snowfall === 0 ? (
        <SunIcon className="fill-arrd-highlight" />
      ) : (
        <></>
      )}
      {forecast.precipitation > 0 && forecast.precipitation_probability >= 45 ? (
        <RainIcon className="fill-arrd-highlight" />
      ) : (
        <></>
      )}
      {forecast.snowfall > 0 && <SnowFlakeIcon className="fill-arrd-highlight" />}
      <div className={dc([forecast.temperature_2m < 16, 'text-cyan-400', 'text-emerald-700'])}>
        {forecast.temperature_2m} {forecast.hourlyUnits.apparent_temperature}
      </div>
    </div>
  )
}
