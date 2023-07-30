import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function address_search(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(403).send('non autorisé')

  const search = req.query.search as string

  const resBano = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${search}&limit=5`)
  const jsonBano = await resBano.json()

  const addresses = jsonBano.features.map((address: any) => {
    const { properties, geometry } = address
    const coordinates = geometry?.coordinates || [null, null]

    console.log(address)
    return {
      label: `${properties.name} - ${properties.postcode} ${properties.city}`,
      value: {
        lat: coordinates[0],
        lon: coordinates[1],
        city: properties.city,
        zipCode: properties.postcode,
        number: properties.housenumber,
        street: properties.street,
        label: `${properties.name} - ${properties.postcode} ${properties.city}`,
      },
    }
  })

  return res.status(200).json(addresses)
}
