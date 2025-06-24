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

// POST - Clear entire wishlist
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const userId = getUserIdFromRequest(request)
    console.log("🗑️ Clear Wishlist - User ID:", userId)

    if (userId === "guest") {
      return NextResponse.json({ success: true })
    }

    const wishlist = await Wishlist.findOne({ user: userId })
    if (wishlist) {
      wishlist.items = []
      await wishlist.save()
    }

    return NextResponse.json({ success: true, items: [] })
  } catch (error) {
    console.error("Clear wishlist error:", error)
    return NextResponse.json({ error: "Failed to clear wishlist" }, { status: 500 })
  }
}
