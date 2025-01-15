import { NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';
import { MongoClient } from 'mongodb';
import { TonClient } from '@ton/ton';

const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
const tonClient = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
});

// This is the main function that handles the request
export async function POST(req: NextApiRequest) {
  try {
    const { transactionHash, address } = await req.json();

    // Verify the transaction on the TON blockchain
    const transaction = await tonClient.getTransactions(address, { limit: 1, lt: transactionHash });

    if (transaction && transaction[0].in_msg.value === '1000000000') { // 1 TON in nanotons
      // Update user's game pass status in the database
      const db = mongoClient.db('cbe');
      const users = db.collection('users');
      await users.updateOne(
        { tonAddress: address },
        { $set: { hasGamePass: true } }
      );

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid transaction' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}