import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Wishlist from "@/models/Wishlist"
import jwt from "jsonwebtoken"

// Helper function to get user ID from request
function getUserIdFromRequest(request: NextRequest): string {
  try {
    const authorization = request.headers.get("authorization")
    if (!authorization?.startsWith("Bearer ")) {
      return "guest"
    }
    
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as any
    return decoded.userId || decoded.id || "guest"
  } catch (error) {
    return "guest"
  }
}

// PUT - Update wishlist item (priority, notes, etc.)
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { itemId, priority, notes } = await request.json()
    const userId = getUserIdFromRequest(request)

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 })
    }

    if (userId === "guest") {
      return NextResponse.json({ success: true })
    }

    const wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    const itemIndex = wishlist.items.findIndex((item: any) => item.id === itemId)
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Update item properties
    if (priority) wishlist.items[itemIndex].priority = priority
    if (notes !== undefined) wishlist.items[itemIndex].notes = notes

    await wishlist.save()
    await wishlist.populate('items.productId')
    
    return NextResponse.json({ items: wishlist.items })
  } catch (error) {
    console.error("Update wishlist item error:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}
