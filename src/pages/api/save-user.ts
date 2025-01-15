import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

const saveUserData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { telegramId, clicks, tonAddress } = req.body;

  if (!telegramId || !tonAddress || typeof clicks !== 'number') {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('your_database_name'); // Replace with your database name

    // Save or update user data
    await db.collection('users').updateOne(
      { telegramId },
      { $set: { clicks, tonAddress } },
      { upsert: true }
    );

    return res.status(200).json({ message: 'User data saved successfully' });
  } catch (error) {
    console.error('Error saving user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default saveUserData; 