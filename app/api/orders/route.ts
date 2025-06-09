import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Order = require("../../../models/Order")

export async function GET(request: Request) {
  await connectToDatabase()
  const orders = await Order.find()
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const order = await Order.create(data)
    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add order" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    if (!data._id) return NextResponse.json({ error: "Missing order id" }, { status: 400 })
    const updated = await Order.findByIdAndUpdate(data._id, data, { new: true, runValidators: true })
    if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase()
    const { _id } = await request.json()
    if (!_id) return NextResponse.json({ error: "Missing order id" }, { status: 400 })
    const deleted = await Order.findByIdAndDelete(_id)
    if (!deleted) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete order" }, { status: 500 })
  }
}
