import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

const saveUserData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { telegramId, telegramName, clicks } = req.body;

  if (!telegramId || !telegramName || typeof clicks !== 'number') {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('cbe'); // Replace with your actual database name
    const usersCollection = db.collection('users');

    // Save or update user data
    await usersCollection.updateOne(
      { telegramId: Number(telegramId) }, // Ensure telegramId is stored as a number
      { $set: { telegramName, clicks } },
      { upsert: true }
    );

    return res.status(200).json({ message: 'User data saved successfully' });
  } catch (error) {
    console.error('Error saving user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default saveUserData;
