// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { cors, runMiddleware } from './cors'

type Data = {
  isAlive: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  // Rest of the API logic
  res.status(200).json({ isAlive: true })
}
