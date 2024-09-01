import { NextApiRequest, NextApiResponse } from 'next'
import { midgardMiddleWare } from '@/utils/midgard-middleware'
import hallOfFame from '../../badges/hall_of_fame'

export default (request: NextApiRequest, response: NextApiResponse) => midgardMiddleWare(request, response, hallOfFame)
