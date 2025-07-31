import { NextApiRequest, NextApiResponse } from 'next'

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*']

export function corsMiddleware(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const origin = req.headers.origin

    console.log('corsMiddleware', origin)

    // Gérer les requêtes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes('*') ? '*' : origin || '')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, provider_id, authorization-origin')
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader('Access-Control-Max-Age', '86400') // 24 heures
      return res.status(200).end()
    }

    // Ajouter les headers CORS pour les autres requêtes
    if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    return handler(req, res)
  }
}
