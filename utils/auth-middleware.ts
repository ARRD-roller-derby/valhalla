import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { User } from '@/models'
import { MongoDb } from '@/db'
import * as jose from 'jose'
import { DOL_URL, DOLAPIKEY } from './constants'

export async function authMiddleWare(request: NextApiRequest, response: NextApiResponse, helper: Function) {
  const session = await getServerSession(request, response, authOptions)

  if (session) return helper(request, response, session.user)
  const { headers } = request
  let provider_id = headers?.['x-provider-id']

  if (headers?.['x-provider-id'] && headers?.['authorization']?.replace('Bearer ', '') !== process.env.MIDGARD_TOKEN)
    return response.status(401).json({ error: 'non autorisé' })

  const isV2 = headers['authorization-origin'] === 'valhalla_1'

  if (isV2) {
    const token = headers?.['authorization']?.replace('Bearer ', '') || ''

    const secret = Buffer.from(process.env.API_KEY || '', 'hex')

    const { payload } = await jose.jwtDecrypt(token, secret)

    provider_id = payload.sub
  }

  if (!provider_id) return response.status(401).json({ error: 'aucun id utilisateur' })

  await MongoDb()

  const user = await User.findOne({ providerAccountId: provider_id })

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

  let dolibarrInfos = {}
  if (dolibarrData.length > 0) {
    const result = dolibarrData[0]
    dolibarrInfos = {
      type: result.type,
      birth: result.birth,
      gender: result.gender,
      licence_number: result.array_options.options_nlicence,
      roster_number: result.array_options.options_nroster,
      derby_name: result.array_options.options_derbyname,
      allergies: result.array_options.options_allergies,
      diet: result.array_options.options_rgimealimentaire,
      phone: result.phone_perso,
      town: result.town,
      zip: result.zip,
      address: result.address,
    }
  }

  if (user) {
    return helper(request, response, {
      ...user.toJSON(),
      ...dolibarrInfos,
      id: user._id.toString(),
    })
  }
  return response.status(403).send('non autorisé')
}
