import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Wishlist from "@/models/Wishlist"
import Product from "@/models/Product"
import jwt from "jsonwebtoken"

interface WishlistItem {
  productId: string
  name: string
  price: number
  color: string
  image: string
}

// Helper function to get user ID from request
function getUserIdFromRequest(request: NextRequest): string {
  // Check for JWT token in Authorization header
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as any
      return decoded.id
    } catch (error) {
      console.error("JWT verification failed:", error)
    }
  }
  
  // Fallback to query parameter for guest users
  return request.nextUrl.searchParams.get("userId") || "guest"
}

// Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const userId = getUserIdFromRequest(request)
    
    let wishlist
    if (userId === "guest") {
      // Return empty wishlist for guest users
      wishlist = { items: [] }
    } else {
      wishlist = await Wishlist.findOne({ user: userId }).populate('items.productId')
      if (!wishlist) {
        wishlist = { items: [] }
      }
    }
    
    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Wishlist GET error:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

// Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { productId, name, price, color, image, userId: bodyUserId } = await request.json()
    
    // Get user ID from JWT token, fallback to body
    const userId = getUserIdFromRequest(request) || bodyUserId
    
    if (!productId || !name || !price || !color || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (userId === "guest") {
      // For guest users, return the item data (handled by frontend state)
      return NextResponse.json({
        success: true,
        item: { productId, name, price, color, image }
      })
    }

    // Verify product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] })
    }    // Check if item already exists in wishlist
    const existingItemIndex = wishlist.items.findIndex(
      (item: WishlistItem) => item.productId.toString() === productId && item.color === color
    )

    if (existingItemIndex >= 0) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 400 })
    }

    // Add new item
    wishlist.items.push({
      productId,
      name,
      price,
      color,
      image
    })

    await wishlist.save()
    
    // Populate wishlist items and return
    await wishlist.populate('items.productId')
    return NextResponse.json(wishlist)
    
  } catch (error) {
    console.error("Wishlist POST error:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

// Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const color = searchParams.get("color")
    const queryUserId = searchParams.get("userId")
    
    // Get user ID from JWT token, fallback to query parameter
    const userId = getUserIdFromRequest(request) || queryUserId

    if (!productId || !color || !userId) {
      return NextResponse.json({ error: "Product ID, color, and user ID are required" }, { status: 400 })
    }

    if (userId === "guest") {
      return NextResponse.json({
        success: true,
        message: "Guest wishlist item removed"
      })
    }

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }    // Remove item from wishlist
    wishlist.items = wishlist.items.filter(
      (item: WishlistItem) => !(item.productId.toString() === productId && item.color === color)
    )

    await wishlist.save()
    
    // Populate and return updated wishlist
    await wishlist.populate('items.productId')
    return NextResponse.json(wishlist)
    
  } catch (error) {
    console.error("Wishlist DELETE error:", error)
    return NextResponse.json({ error: "Failed to remove item from wishlist" }, { status: 500 })
  }
}
