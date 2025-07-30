import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Wishlist from "@/models/Wishlist"
import EyewearProduct from "@/models/EyewearProduct"
import jwt from "jsonwebtoken"

interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  color: string
  size?: string
  image: string
  category: string
  inStock: boolean
  discount?: number
  variant?: string
  addedAt: Date
  priority?: 'low' | 'medium' | 'high'
  notes?: string
}

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

// GET - Retrieve user's wishlist
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const userId = getUserIdFromRequest(request)
    console.log("🔍 Modern Wishlist GET - User ID:", userId)
    
    if (userId === "guest") {
      // Return empty wishlist for guest users (handled by frontend)
      return NextResponse.json({ items: [] })
    }

    // Get user's wishlist
    let wishlist = await Wishlist.findOne({ user: userId }).populate('items.productId')
    if (!wishlist) {
      wishlist = { items: [] }
    }

    return NextResponse.json({ items: wishlist.items || [] })
  } catch (error) {
    console.error("Modern Wishlist GET error:", error)
    return NextResponse.json({ error: "Failed to load wishlist" }, { status: 500 })
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const data = await request.json()
    const { 
      productId, name, price, originalPrice, color, size, image, category, 
      inStock, discount, variant, priority, notes 
    } = data
    
    const userId = getUserIdFromRequest(request)
    console.log("💝 Modern Wishlist POST - User ID:", userId)
    
    if (!productId || !name || !price || !color || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (userId === "guest") {
      // Return success for guest users (handled by frontend)
      return NextResponse.json({
        success: true,
        item: { 
          id: `${productId}-${color}-${size || 'default'}`,
          productId, name, price, originalPrice, color, size, image, category, 
          inStock, discount, variant, priority, notes, addedAt: new Date()
        }
      })
    }    // Verify product exists
    const product = await EyewearProduct.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] })
    }

    // Generate unique item ID
    const itemId = `${productId}-${color}-${size || 'default'}`

    // Check if item already exists
    const existingItemIndex = wishlist.items.findIndex((item: any) => 
      item.productId.toString() === productId && 
      item.color === color && 
      (item.size || 'default') === (size || 'default')
    )

    if (existingItemIndex >= 0) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 400 })
    }

    // Add new item
    wishlist.items.push({
      id: itemId,
      productId,
      name,
      price,
      originalPrice: originalPrice || price,
      color,
      size: size || undefined,
      image,
      category: category || product.category,
      inStock: inStock !== undefined ? inStock : product.inStock,
      discount: discount || product.discount,
      variant: variant || undefined,
      addedAt: new Date(),
      priority: priority || 'medium',
      notes: notes || undefined
    })

    await wishlist.save()
    await wishlist.populate('items.productId')
    
    return NextResponse.json({ items: wishlist.items })
  } catch (error) {
    console.error("Modern Wishlist POST error:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")
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

    wishlist.items = wishlist.items.filter((item: any) => item.id !== itemId)
    await wishlist.save()
    await wishlist.populate('items.productId')
    
    return NextResponse.json({ items: wishlist.items })
  } catch (error) {
    console.error("Modern Wishlist DELETE error:", error)
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
  }
}
