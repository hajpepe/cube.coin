import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import TonWeb from 'tonweb';

// Initialize TonWeb with the provider URL
const TON_PROVIDER_URL = 'https://toncenter.com/api/v2/jsonRPC';
const tonweb = new TonWeb(new TonWeb.HttpProvider(TON_PROVIDER_URL));

// Constants for better readability
const DATABASE_NAME = 'cbe'; // Replace with your actual database name
const COLLECTION_NAME = 'users';
const GAME_PASS_VALUE = '1000000000'; // 1 TON in nanotons as a string

/**
 * Handles the POST request to verify the purchase.
 * @param req - The incoming request object.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(req: Request) {
  try {
    const { transactionHash, address } = await req.json();

    // Validate input
    if (!transactionHash || !address) {
      return NextResponse.json(
        { success: false, error: 'Transaction hash and address are required.' },
        { status: 400 }
      );
    }

    // Fetch the transaction history for the given address
    const transactions = await tonweb.getTransactions(address, 1);

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No transactions found for the given address.' },
        { status: 400 }
      );
    }

    const transaction = transactions[0];

    // Check if the transaction hash matches
    if (transaction.transaction_id.hash !== transactionHash) {
      return NextResponse.json(
        { success: false, error: 'Transaction hash does not match.' },
        { status: 400 }
      );
    }

    // Validate the incoming message value
    if (transaction.in_msg.value !== GAME_PASS_VALUE) {
      return NextResponse.json(
        { success: false, error: 'Transaction value does not match the required amount.' },
        { status: 400 }
      );
    }

    // Connect to the MongoDB client
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const usersCollection = db.collection(COLLECTION_NAME);

    // Update user's game pass status in the database
    const updateResult = await usersCollection.updateOne(
      { tonAddress: address },
      { $set: { hasGamePass: true } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update game pass status.' },
        { status: 500 }
      );
    }

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
