import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
import { TonClient } from '@ton/ton'

const mongoClient = new MongoClient(process.env.MONGODB_URI as string)
const tonClient = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { transactionHash, address } = req.body
      
      // Verify the transaction on the TON blockchain
      const transaction = await tonClient.getTransactions(address, { limit: 1, lt: transactionHash })
      
      if (transaction && transaction[0].in_msg.value === '1000000000') { // 1 TON in nanotons
        // Update user's game pass status in the database
        const db = mongoClient.db('LwfFFvqAuBpn7f2N')
        const users = db.collection('users')
        await users.updateOne(
          { tonAddress: address },
          { $set: { hasGamePass: true } }
        )
        
        res.status(200).json({ success: true })
      } else {
        res.status(400).json({ success: false, error: 'Invalid transaction' })
      }
    } catch (error) {
      console.error('Error verifying purchase:', error)
      res.status(500).json({ success: false, error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}