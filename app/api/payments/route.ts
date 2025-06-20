import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Payment = require("../../../models/Payment")

export async function GET(request: Request) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const method = searchParams.get('method')
    
    let query: any = {}
    if (status && status !== 'all') query.status = status
    if (method && method !== 'all') query.method = method
    
    const payments = await Payment.find(query)
      .populate('orderId', '_id orderNumber')
      .sort({ createdAt: -1 })
    
    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    
    // Validate required fields for payment
    if (!data.amount) {
      return NextResponse.json({ error: "Missing required field: amount" }, { status: 400 })
    }
    
    // Set default values
    const paymentData = {
      ...data,
      status: data.status || 'pending',
      method: data.method || 'mpesa',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const payment = await Payment.create(paymentData)
    return NextResponse.json(payment, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add payment" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    
    if (!data._id) return NextResponse.json({ error: "Missing payment id" }, { status: 400 })
    
    // Update the updatedAt timestamp
    data.updatedAt = new Date()
    
    const updated = await Payment.findByIdAndUpdate(data._id, data, { new: true, runValidators: true })
    if (!updated) return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update payment" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase()
    const { _id } = await request.json()
    if (!_id) return NextResponse.json({ error: "Missing payment id" }, { status: 400 })
    const deleted = await Payment.findByIdAndDelete(_id)
    if (!deleted) return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete payment" }, { status: 500 })
  }
}
