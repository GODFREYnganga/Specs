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

// POST - Generate shareable wishlist link
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const userId = getUserIdFromRequest(request)
    console.log("🔗 Wishlist Share - User ID:", userId)
    
    if (userId === "guest") {
      return NextResponse.json(
        { error: "Please log in to share your wishlist" },
        { status: 401 }
      )
    }

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId }).populate('items.productId')
    
    if (!wishlist || wishlist.items.length === 0) {
      return NextResponse.json(
        { error: "Your wishlist is empty" },
        { status: 400 }
      )
    }

    // Generate a simple share token (in production, use a more sophisticated approach)
    const shareToken = Buffer.from(`${userId}-${Date.now()}`).toString('base64')
    
    // Update wishlist with share token and make it public
    wishlist.shareToken = shareToken
    wishlist.isPublic = true
    await wishlist.save()

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/wishlist/shared/${shareToken}`

    return NextResponse.json({
      success: true,
      shareUrl,
      message: "Wishlist share link generated successfully"
    })

  } catch (error) {
    console.error("Share wishlist error:", error)
    return NextResponse.json(
      { error: "Failed to generate share link" },
      { status: 500 }
    )
  }
}
