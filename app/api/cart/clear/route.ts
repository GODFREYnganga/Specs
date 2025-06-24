import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Cart from "@/models/Cart"
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

// POST - Clear entire cart
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const userId = getUserIdFromRequest(request)
    console.log("🗑️ Clear Cart - User ID:", userId)

    if (userId === "guest") {
      return NextResponse.json({ success: true })
    }

    const cart = await Cart.findOne({ user: userId })
    if (cart) {
      cart.items = []
      await cart.save()
    }

    return NextResponse.json({ success: true, items: [] })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
