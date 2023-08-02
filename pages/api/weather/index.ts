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
import { Weather } from '@/models'

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

  const latQuery = req.query.lat as string
  const lonQuery = req.query.lon as string

  if (!latQuery || !lonQuery) return res.status(400).send('lat et lon sont obligatoires')

  const lat = Number(latQuery).toFixed(2).toString()
  const lon = Number(lonQuery).toFixed(2).toString()

  const existingWeather = await Weather.findOne({
    lat,
    lon,
    updatedAt: { $gte: dayjs().subtract(5, 'hour').toISOString() },
  })

  if (existingWeather) return res.status(200).json(existingWeather)

  const resApi = await fetch(`${WEATHER_API_URL}&latitude=${lat}&longitude=${lon}`)
  const resJson = await resApi.json()
  const response = {
    lat: resJson.latitude,
    lon: resJson.longitude,
    timezone: resJson.timezone,
    hourly: {
      ...resJson.hourly,
      time: resJson.hourly.time.filter((hour: string) => dayjs(hour + 'Z').isAfter(dayjs())),
    },
    hourlyUnits: resJson.hourly_units,
  }

  const existingWeatherWithoutDate = await Weather.findOne({ lat, lon })

  if (existingWeatherWithoutDate) {
    existingWeatherWithoutDate.updateAt(new Date())
    await existingWeatherWithoutDate.save()
  } else {
    await Weather.create({ ...response, lat, lon, updatedAt: new Date() })
  }

  return res.status(200).json(response)
}
