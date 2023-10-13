// Bibliothèque externe
import { NextApiRequest, NextApiResponse } from 'next'
process.env.TZ = 'Europe/Paris'

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

import { midgardMiddleWare } from '@/utils/midgard-middleware'
import { IUser } from '@/models'
import { DOLAPIKEY, DOL_URL, dolibarrMemberParser } from '@/utils'

// Initialiser le fuseau horaire
process.env.TZ = 'Europe/Paris'

async function me(_req: NextApiRequest, res: NextApiResponse, user: IUser) {
  const params = new URLSearchParams({
    DOLAPIKEY: DOLAPIKEY,
    limit: '1',
    sqlfilters: `(t.note_private:like:%${user.providerAccountId}%)`,
  })

  const dolibarrRes = await fetch(`${DOL_URL}members?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const dolibarrData = await dolibarrRes.json()

  const dolibarrInfos = dolibarrMemberParser(dolibarrData, user, user.providerAccountId)

  return res.status(200).json({
    ...user,
    ...dolibarrInfos,
  })
}

const helper = (request: NextApiRequest, response: NextApiResponse) => midgardMiddleWare(request, response, me)

export default helper
