import type { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleWare } from '@/utils/auth-middleware'

type Rule = {
  chapter: string
  description: string
  title: string
}

async function rules(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const search = req.query.search
  if (Array.isArray(search)) return res.status(400).json({ error: 'Recherche invalide' })

  const safeSearch = search?.trim() || ''
  if (safeSearch.length > 250) return res.status(400).json({ error: 'Recherche trop longue' })

  const apiUrl = process.env.URL_API_DERBY_FRANCE || process.env.NEXT_PUBLIC_URL_API_DERBY_FRANCE
  if (!apiUrl) return res.status(500).json({ error: 'API des règles non configurée' })

  const url = new URL(safeSearch ? `rules/search/${encodeURIComponent(safeSearch)}` : 'rules', apiUrl).toString()

  try {
    const apiResponse = await fetch(url, {
      headers: { Accept: 'application/json' },
    })

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: 'L’API des règles est indisponible' })
    }

    const data = (await apiResponse.json()) as Rule[]
    return res.status(200).json(data)
  } catch (error) {
    console.error('Impossible de récupérer les règles', error)
    return res.status(502).json({ error: 'L’API des règles est indisponible' })
  }
}

export default (request: NextApiRequest, response: NextApiResponse) => authMiddleWare(request, response, rules)
