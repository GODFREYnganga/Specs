import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Payment = require("../../../models/Payment")

export async function GET() {
  await connectToDatabase()
  const payments = await Payment.find()
  return NextResponse.json(payments)
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const payment = await Payment.create(data)
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
