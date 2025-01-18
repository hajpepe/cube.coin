import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Ensure this path is correct
import TonWeb from 'tonweb'; // Import TonWeb library

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));

// Main function to handle the POST request
export async function POST(req: Request) {
  try {
    const { transactionHash, address } = await req.json();

    // Fetch the transaction history for the given address
    const transactions = await tonweb.getTransactions(address, 1);

    if (transactions && transactions.length > 0) {
      const transaction = transactions[0];

      // Check if the transaction hash matches
      if (transaction.transaction_id.hash === transactionHash) {
        // Access the incoming message value
        const inMsgValue = transaction.in_msg.value;

        if (inMsgValue === '1000000000') { // 1 TON in nanotons as a string
          // Connect to the MongoDB client
          const client = await clientPromise;
          const db = client.db('cbe'); // Replace with your actual database name
          const users = db.collection('users');

          // Update user's game pass status in the database
          await users.updateOne(
            { tonAddress: address },
            { $set: { hasGamePass: true } }
          );

          return NextResponse.json({ success: true });
        }
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid transaction' }, { status: 400 });
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
