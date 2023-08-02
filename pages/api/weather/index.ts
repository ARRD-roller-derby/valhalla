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

  const lat = req.query.lat as string
  const lon = req.query.lon as string

  if (!lat || !lon) return res.status(400).send('lat et lon sont obligatoires')

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

  return res.status(200).json(response)
}
