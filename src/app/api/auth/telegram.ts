import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const telegramAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  // Extract parameters from the query
  const { id, first_name, last_name, username, photo_url, auth_date, hash } = query;

  // Validate the Telegram authentication response
  const secret = process.env.TELEGRAM_BOT_TOKEN; // Your bot token
  const dataCheckString = `${id}\n${first_name}\n${last_name}\n${username}\n${photo_url}\n${auth_date}\n${secret}`;
  const hashCheck = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  if (hash !== hashCheck) {
    return res.status(403).json({ message: 'Invalid signature' });
  }

  // Redirect to the frontend with user data
  res.redirect(`/page?telegramId=${id}&tonAddress=your_ton_address&clicks=0`); // Replace with actual TON address if available
};

export default telegramAuth;