import axios from 'axios';
import { getAccessToken } from './accessToken';
import dotenv from 'dotenv';

dotenv.config();

export const initiateStkPush = async (phone: string, amount: number, orderId?: string) => {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: process.env.SHORTCODE!,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.SHORTCODE!,
    PhoneNumber: phone,
    CallBackURL: `${process.env.BASE_URL}/api/mpesa/callback`,
    AccountReference: orderId || `ORDER-${Date.now()}`,
    TransactionDesc: `Payment for ${orderId || 'Order'}`
  };

  const response = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};

const phoneNumber = "254712345678"; // Replace with the actual phone number
const amount = 100; // Replace with the actual amount               