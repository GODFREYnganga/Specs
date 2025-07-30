import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Cart from "@/models/Cart"
import EyewearProduct from "@/models/EyewearProduct"
import Settings from "@/models/Settings"
import jwt from "jsonwebtoken"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
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
      console.log("🔑 JWT decoded:", decoded.id)
      return decoded.id
    } catch (error) {
      console.error("JWT verification failed:", error)
    }
  }
  
  // Fallback to query parameter for guest users
  const queryUserId = request.nextUrl.searchParams.get("userId")
  console.log("🔍 Query userId:", queryUserId)
  return queryUserId || "guest"
}

// Get user's cart
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const userId = getUserIdFromRequest(request)
    console.log("🔍 Cart GET - User ID:", userId)
    
    let cart
    if (userId === "guest") {
      // Return empty cart for guest users (frontend handles localStorage)
      cart = { items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 }
    } else {
      cart = await Cart.findOne({ user: userId }).populate('items.productId')
      if (!cart) {
        cart = { items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 }
      }
      console.log("📦 Found cart for user:", cart.items?.length || 0, "items")
    }
    
    return NextResponse.json(cart)
  } catch (error) {
    console.error("Cart GET error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { productId, name, price, quantity, color, image, userId: bodyUserId } = await request.json()
    
    // Get user ID from JWT token, fallback to body
    const userId = getUserIdFromRequest(request) || bodyUserId
    console.log("🛒 Cart POST - User ID:", userId)
    console.log("📦 Cart POST - Item:", { productId, name, price, quantity, color, image })
    
    if (!productId || !name || !price || !quantity || !color || !image) {
      console.log("❌ Missing required fields:", { productId, name, price, quantity, color, image })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (userId === "guest") {
      console.log("👤 Guest user - returning success")
      // For guest users, return the item data (handled by frontend state)
      return NextResponse.json({
        success: true,
        item: { productId, name, price, quantity, color, image }
      })
    }    // Verify product exists
    const product = await EyewearProduct.findById(productId)
    if (!product) {
      console.log("❌ Product not found:", productId)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      console.log("🆕 Creating new cart for user:", userId)
      cart = new Cart({ user: userId, items: [] })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: CartItem) => item.productId.toString() === productId && item.color === color
    )

    if (existingItemIndex >= 0) {
      // Update quantity
      console.log("🔄 Updating existing item quantity")
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      console.log("➕ Adding new item to cart")
      cart.items.push({
        productId,
        name,
        price,
        quantity,
        color,
        image
      })
    }

    await cart.save()
    console.log("💾 Cart saved with", cart.items.length, "items")
    
    // Populate cart items and return
    await cart.populate('items.productId')
    return NextResponse.json(cart)
    
  } catch (error) {
    console.error("Cart POST error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { productId, color, quantity, userId: bodyUserId } = await request.json()
    
    // Get user ID from JWT token, fallback to body
    const userId = getUserIdFromRequest(request) || bodyUserId

    if (!productId || !color || quantity === undefined || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (userId === "guest") {
      return NextResponse.json({
        success: true,
        message: "Guest cart updated"
      })
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item: CartItem) => item.productId.toString() === productId && item.color === color
    )

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1)
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity
    }

    await cart.save()
    
    // Populate and return updated cart
    await cart.populate('items.productId')
    return NextResponse.json(cart)
    
  } catch (error) {
    console.error("Cart PUT error:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

// Remove item from cart
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
        message: "Guest cart item removed"
      })
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item: CartItem) => !(item.productId.toString() === productId && item.color === color)
    )

    await cart.save()
    
    // Populate and return updated cart
    await cart.populate('items.productId')
    return NextResponse.json(cart)
    
  } catch (error) {
    console.error("Cart DELETE error:", error)
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 })
  }
}
