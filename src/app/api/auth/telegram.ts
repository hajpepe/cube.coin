import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const telegramAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  // Extract parameters from the query
  const { id, first_name, last_name, username, photo_url, auth_date, hash } = query;

  // Get the bot token from environment variables
  const secret = process.env.TELEGRAM_BOT_TOKEN;

  // Check if the secret is defined
  if (!secret) {
    console.error('Telegram bot token is not set');
    return res.status(500).json({ message: 'Internal server error: Telegram bot token is not set' });
  }

  // Validate the Telegram authentication response
  const dataCheckString = `${id}\n${first_name}\n${last_name}\n${username}\n${photo_url}\n${auth_date}`;
  const hashCheck = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  if (hash !== hashCheck) {
    return res.status(403).json({ message: 'Invalid signature' });
  }

  // Redirect to the frontend with user data
  res.redirect(`/page?telegramId=${id}&tonAddress=your_ton_address&clicks=0`); // Replace with actual TON address if available
};

export default telegramAuth;