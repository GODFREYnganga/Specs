import { NextResponse } from 'next/server'
import axios from 'axios'
import { getAccessToken } from '@/mpesa/accessToken'
import { connectToDatabase } from '@/lib/mongodb'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Payment = require('../../../../models/Payment')

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { checkoutRequestId, orderId } = await request.json()

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: 'Missing checkoutRequestId' }, 
        { status: 400 }
      )
    }

    // First check if we have a payment record with this checkout request ID
    const payment = await Payment.findOne({
      'mpesaData.checkoutRequestId': checkoutRequestId
    })

    if (payment && payment.status === 'completed') {
      return NextResponse.json({
        status: 'completed',
        message: 'Payment successful',
        transactionId: payment.mpesaData?.mpesaReceiptNumber,
        amount: payment.amount,
        phoneNumber: payment.mpesaData?.phoneNumber
      })
    }

    // If no completed payment found, query M-Pesa API
    const token = await getAccessToken()
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = Buffer.from(`${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`).toString('base64')

    const queryPayload = {
      BusinessShortCode: process.env.SHORTCODE!,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    }

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      queryPayload,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const mpesaResponse = response.data
    
    // Parse M-Pesa response and return standardized format
    if (mpesaResponse.ResultCode === '0') {
      return NextResponse.json({
        status: 'completed',
        message: 'Payment successful',
        transactionId: mpesaResponse.MpesaReceiptNumber,
        amount: payment?.amount,
        phoneNumber: payment?.customerPhone
      })
    } else if (mpesaResponse.ResultCode === '1032') {
      return NextResponse.json({
        status: 'failed',
        message: 'Payment was cancelled by user'
      })
    } else if (mpesaResponse.ResultCode === '1037') {
      return NextResponse.json({
        status: 'timeout',
        message: 'Payment request timed out'
      })
    } else if (mpesaResponse.ResultCode === '1001') {
      return NextResponse.json({
        status: 'pending',
        message: 'Payment is still being processed'
      })
    } else {
      return NextResponse.json({
        status: 'failed',
        message: mpesaResponse.ResultDesc || 'Payment failed'
      })
    }

  } catch (error) {
    console.error('M-Pesa query error:', error)
    return NextResponse.json({
      status: 'pending',
      message: 'Still checking payment status...'
    })
  }
}
