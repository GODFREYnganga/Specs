import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Payment = require('../../../../models/Payment')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Order = require('../../../../models/Order')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('M-Pesa Callback received:', JSON.stringify(body, null, 2))

    await connectToDatabase()

    // Extract callback data
    const callbackData = body.Body?.stkCallback

    if (!callbackData) {
      console.log('No callback data found')
      return NextResponse.json({ message: 'No callback data' })
    }

    const checkoutRequestId = callbackData.CheckoutRequestID
    const resultCode = callbackData.ResultCode
    const resultDesc = callbackData.ResultDesc

    // Find the order by checkout request ID (you'll need to store this during initiation)
    const payment = await Payment.findOne({ 
      transactionId: checkoutRequestId 
    })

    if (!payment) {
      console.log('Payment not found for CheckoutRequestID:', checkoutRequestId)
      return NextResponse.json({ message: 'Payment not found' })
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = callbackData.CallbackMetadata?.Item || []
      const mpesaReceiptNumber = callbackMetadata.find(
        (item: any) => item.Name === 'MpesaReceiptNumber'
      )?.Value

      const transactionDate = callbackMetadata.find(
        (item: any) => item.Name === 'TransactionDate'
      )?.Value

      const phoneNumber = callbackMetadata.find(
        (item: any) => item.Name === 'PhoneNumber'
      )?.Value

      // Update payment status
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'completed',
        transactionId: mpesaReceiptNumber || checkoutRequestId,
        updatedAt: new Date(),
        mpesaData: {
          mpesaReceiptNumber,
          transactionDate,
          phoneNumber,
          checkoutRequestId
        }
      })

      // Update order status
      await Order.findByIdAndUpdate(payment.orderId, {
        status: 'confirmed',
        paymentStatus: 'paid',
        updatedAt: new Date()
      })

      console.log('Payment completed successfully:', mpesaReceiptNumber)

    } else {
      // Payment failed
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'failed',
        updatedAt: new Date(),
        failureReason: resultDesc
      })

      await Order.findByIdAndUpdate(payment.orderId, {
        status: 'cancelled',
        paymentStatus: 'failed',
        updatedAt: new Date()
      })

      console.log('Payment failed:', resultDesc)
    }

    return NextResponse.json({ message: 'Callback processed successfully' })

  } catch (error) {
    console.error('M-Pesa callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
