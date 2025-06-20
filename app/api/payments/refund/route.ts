import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Payment = require("../../../../models/Payment")

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { paymentId, amount, reason } = await request.json()
    
    if (!paymentId || !amount) {
      return NextResponse.json({ error: "Missing required fields: paymentId and amount" }, { status: 400 })
    }
    
    // Find the original payment
    const originalPayment = await Payment.findById(paymentId)
    if (!originalPayment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }
    
    if (originalPayment.status !== 'completed') {
      return NextResponse.json({ error: "Can only refund completed payments" }, { status: 400 })
    }
    
    if (amount > originalPayment.amount) {
      return NextResponse.json({ error: "Refund amount cannot exceed original payment amount" }, { status: 400 })
    }
    
    // Create refund record
    const refundData = {
      orderId: originalPayment.orderId,
      amount: -Math.abs(amount), // Negative amount for refund
      method: originalPayment.method,
      status: 'refunded',
      user: originalPayment.user,
      refundReason: reason || 'No reason provided',
      originalPaymentId: paymentId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const refund = await Payment.create(refundData)
    
    // Update original payment status if full refund
    if (amount === originalPayment.amount) {
      await Payment.findByIdAndUpdate(paymentId, { 
        status: 'refunded',
        updatedAt: new Date()
      })
    }
    
    return NextResponse.json(refund, { status: 201 })
  } catch (err) {
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : "Failed to process refund" 
    }, { status: 500 })
  }
}
