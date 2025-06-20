import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Shipping = require("../../../models/Shipping")

export async function GET(request: Request) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const carrier = searchParams.get('carrier')
    
    let query: any = {}
    if (status && status !== 'all') query.status = status
    if (carrier && carrier !== 'all') query.carrier = carrier
    
    const shipping = await Shipping.find(query)
      .populate('orderId', '_id orderNumber')
      .sort({ createdAt: -1 })
    
    return NextResponse.json(shipping)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    
    // Validate required fields
    if (!data.orderId || !data.carrier) {
      return NextResponse.json({ error: "Missing required fields: orderId and carrier" }, { status: 400 })
    }
    
    // Set default values
    const shipmentData = {
      ...data,
      status: data.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const shipping = await Shipping.create(shipmentData)
    return NextResponse.json(shipping, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add shipping" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    
    if (!data._id) return NextResponse.json({ error: "Missing shipping id" }, { status: 400 })
    
    // Update the updatedAt timestamp
    data.updatedAt = new Date()
    
    const updated = await Shipping.findByIdAndUpdate(data._id, data, { new: true, runValidators: true })
    if (!updated) return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update shipping" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase()
    const { _id } = await request.json()
    if (!_id) return NextResponse.json({ error: "Missing shipping id" }, { status: 400 })
    const deleted = await Shipping.findByIdAndDelete(_id)
    if (!deleted) return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete shipping" }, { status: 500 })
  }
}
