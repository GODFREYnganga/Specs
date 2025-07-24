import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');

  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });

  return response.data.access_token;
};
