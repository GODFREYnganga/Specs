import { NextResponse } from 'next/server'
import { initiateStkPush } from '@/mpesa/stkPush'
import { connectToDatabase } from '@/lib/mongodb'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Payment = require('../../../../models/Payment')

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { phoneNumber, amount, orderId } = await request.json()

    // Validate required fields
    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber, amount, orderId' }, 
        { status: 400 }
      )
    }

    // Format phone number to 254 format
    let formattedPhone = phoneNumber.replace(/\D/g, '') // Remove non-digits
    
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1)
    } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
      formattedPhone = '254' + formattedPhone
    }

    // Validate phone number format
    if (!formattedPhone.match(/^254[71]\d{8}$/)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use format: 0712345678 or 254712345678' }, 
        { status: 400 }
      )
    }

    // Initiate STK Push
    const stkResponse = await initiateStkPush(formattedPhone, Math.round(amount), orderId)

    if (stkResponse.ResponseCode === '0') {
      // Update payment record with M-Pesa data
      await Payment.findOneAndUpdate(
        { orderId: orderId, method: 'mpesa' },
        {
          $set: {
            'mpesaData.checkoutRequestId': stkResponse.CheckoutRequestID,
            'mpesaData.merchantRequestId': stkResponse.MerchantRequestID,
            'mpesaData.phoneNumber': formattedPhone,
            updatedAt: new Date()
          }
        }
      )

      return NextResponse.json({
        success: true,
        message: 'STK Push sent successfully',
        data: {
          CheckoutRequestID: stkResponse.CheckoutRequestID,
          MerchantRequestID: stkResponse.MerchantRequestID
        }
      })
    } else {
      return NextResponse.json(
        { 
          success: false,
          message: stkResponse.ResponseDescription || 'Failed to initiate payment' 
        }, 
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('M-Pesa initiation error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}
