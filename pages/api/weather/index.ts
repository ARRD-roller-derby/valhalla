import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { WEATHER_API_URL } from '@/utils'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'
import { Address, Weather } from '@/models'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

process.env.TZ = 'Europe/Paris'

export default async function address_search(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')

  const addresses = await Address.find()
  const forecastsToCreate = []
  const forecastsToUpdate = []

  // Recherche des prévisions météo existantes pour les adresses
  const existingForecasts = await Weather.find({
    $or: addresses.map((address) => ({ lat: address.lat, lon: address.lon })),
  })

  // TODO revoir les adresses, inversion des lat et lon
  // Filtrage des adresses avec et sans prévisions
  const addressesWithForecast = existingForecasts.map((forecast) => ({
    lat: forecast.lon,
    lon: forecast.lat,
  }))

  const addressesWithoutForecast = addresses.filter(
    (address) => !addressesWithForecast.some((forecast) => forecast.lat === address.lat && forecast.lon === address.lon)
  )

  // Création des prévisions manquantes
  for (const address of addressesWithoutForecast) {
    try {
      const resApi = await fetch(
        `${WEATHER_API_URL}&latitude=${address.lat.toFixed(2)}&longitude=${address.lon.toFixed(2)}`
      )
      const resJson = await resApi.json()
      const newForecast = {
        lat: address.lon,
        lon: address.lat,
        timezone: resJson.timezone,
        hourly: {
          ...resJson.hourly,
          time: resJson.hourly.time.filter((hour: string) => dayjs(hour + 'Z').isAfter(dayjs())),
        },
        hourlyUnits: resJson.hourly_units,
      }
      forecastsToCreate.push(newForecast)
    } catch (error) {
      console.error(`Failed to create forecast for address ${address.lat}, ${address.lon}`, error)
    }
  }

  // Mise à jour des prévisions obsolètes
  for (const forecast of existingForecasts) {
    if (dayjs(forecast.hourly.time[0] + 'Z').isBefore(dayjs().subtract(3, 'hour'))) {
      try {
        const resApi = await fetch(`${WEATHER_API_URL}&latitude=${forecast.lat}&longitude=${forecast.lon}`)
        const resJson = await resApi.json()

        const updatedForecast = {
          timezone: resJson.timezone,
          hourly: {
            ...resJson.hourly,
            time: resJson.hourly.time.filter((hour: string) => dayjs(hour + 'Z').isAfter(dayjs())),
          },
          hourlyUnits: resJson.hourly_units,
        }
        forecastsToUpdate.push({ id: forecast._id, forecast: updatedForecast })
        await Weather.updateOne({ _id: forecast._id }, updatedForecast)
      } catch (error) {
        console.error(`Failed to update forecast for address ${forecast.lat}, ${forecast.lon}:`, error)
      }
    }
  }

  // Création des prévisions manquantes en une seule opération
  if (forecastsToCreate.length > 0) {
    await Weather.create(forecastsToCreate)
  }

  const forecasts = await Weather.find()

  return res.status(200).json({ forecasts })
}
