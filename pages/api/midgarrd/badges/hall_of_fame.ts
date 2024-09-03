import { NextApiRequest, NextApiResponse } from 'next'
import { midgardMiddleWarewithoutUser } from '@/utils/midgard-middleware'
import hallOfFame from '../../badges/hall_of_fame'

export default (request: NextApiRequest, response: NextApiResponse) =>
  midgardMiddleWarewithoutUser(request, response, hallOfFame)
