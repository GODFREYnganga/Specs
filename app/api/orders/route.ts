import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import jwt from "jsonwebtoken"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Order = require("../../../models/Order")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Payment = require("../../../models/Payment")

// Helper function to get user ID from request
function getUserIdFromRequest(request: Request): string | null {
  try {
    const authorization = request.headers.get("authorization")
    if (!authorization?.startsWith("Bearer ")) {
      return null
    }
    
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as any
    return decoded.id || decoded.userId || null
  } catch (error) {
    return null
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase()
    
    // Get orders with populated user data and sort by newest first
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
    
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    
    // Check authentication
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    const data = await request.json()
    
    // Generate order number if not provided
    if (!data.orderNumber) {
      const orderCount = await Order.countDocuments()
      data.orderNumber = `ORD-${(orderCount + 1).toString().padStart(6, '0')}`
    }
    
    // Add user information to order
    data.user = userId
    data.status = data.status || 'pending'
    data.createdAt = new Date()
    data.updatedAt = new Date()
    
    const order = await Order.create(data)
    
    // Create payment record if payment method is provided
    if (data.paymentMethod?.type) {
      const paymentData = {
        orderId: order._id,
        amount: data.totals?.total || 0,
        method: data.paymentMethod.type,
        status: 'pending',
        customerEmail: data.shippingAddress?.email,
        customerName: `${data.shippingAddress?.firstName || ''} ${data.shippingAddress?.lastName || ''}`.trim(),
        customerPhone: data.paymentMethod.type === 'mpesa' ? data.paymentMethod.phoneNumber : data.shippingAddress?.phone,
        user: userId, // Add user ID to payment record
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await Payment.create(paymentData)
    }
    
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
