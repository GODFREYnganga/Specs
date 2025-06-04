import { NextResponse } from "next/server"
import type { Order } from "@/types/user"

// In a real app, this would be stored in a database
const orders: Order[] = []

export async function GET(request: Request) {
  // In a real app, you would verify the user's JWT token
  // and only return their orders

  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, shippingAddress, paymentMethod } = body

    // Validate input
    if (!items || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    // Create new order
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 15),
      userId: "user123", // In a real app, this would come from the JWT token
      items,
      total,
      status: "pending",
      shippingAddress,
      paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save order
    orders.push(newOrder)

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
