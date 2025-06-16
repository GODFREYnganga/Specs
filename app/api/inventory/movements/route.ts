import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"

// Get stock movements
export async function GET() {
  try {
    await connectToDatabase()
    
    // For now, we'll return mock data since we need to create a StockMovement model
    // In a real implementation, you'd fetch from a StockMovement collection
    const mockMovements = [
      {
        _id: "1",
        productId: "prod1",
        productName: "Urban Classic",
        type: "restock",
        quantity: 50,
        previousStock: 10,
        newStock: 60,
        reason: "New shipment received",
        date: new Date().toISOString(),
        user: "Admin"
      },
      {
        _id: "2",
        productId: "prod2",
        productName: "Sunset Aviator",
        type: "sale",
        quantity: -5,
        previousStock: 25,
        newStock: 20,
        reason: "Online sale",
        date: new Date(Date.now() - 86400000).toISOString(),
        user: "System"
      },
      {
        _id: "3",
        productId: "prod3",
        productName: "Reading Pro",
        type: "adjustment",
        quantity: -2,
        previousStock: 15,
        newStock: 13,
        reason: "Damaged items removed",
        date: new Date(Date.now() - 172800000).toISOString(),
        user: "Admin"
      }
    ]
    
    return NextResponse.json(mockMovements)
  } catch (error) {
    console.error("Get stock movements error:", error)
    return NextResponse.json({ error: "Failed to fetch stock movements" }, { status: 500 })
  }
}
