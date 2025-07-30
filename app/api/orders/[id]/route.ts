import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Order = require("../../../../models/Order")

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const order = await Order.findById(params.id)
      .populate('user', 'firstName lastName email')
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
