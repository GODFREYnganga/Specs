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
  originalPrice?: number
  quantity: number
  color: string
  size?: string
  image: string
  category: string
  inStock: boolean
  maxQuantity?: number
  discount?: number
  variant?: string
}

// Helper function to get user ID from request
function getUserIdFromRequest(request: NextRequest): string {
  try {
    const authorization = request.headers.get("authorization")
    if (!authorization?.startsWith("Bearer ")) {
      return "guest"
    }
      const token = authorization.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_super_secure_jwt_secret_key_for_spectacles_ecommerce_2024") as any
    return decoded.userId || decoded.id || "guest"
  } catch (error) {
    return "guest"
  }
}

// GET - Retrieve user's cart
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const userId = getUserIdFromRequest(request)
    console.log("🔍 Modern Cart GET - User ID:", userId)
    
    if (userId === "guest") {
      // Return empty cart for guest users (handled by frontend)
      return NextResponse.json({ 
        items: [], 
        totals: { subtotal: 0, shipping: 0, tax: 0, total: 0, itemCount: 0 },
        settings: {}
      })
    }    // Get user's cart
    let cart = await Cart.findOne({ user: userId }).populate('items.productId')
    if (!cart) {
      cart = { items: [] }
    }

    // Get store settings for calculations
    const settings = await Settings.findOne({}) || {}
    
    // Calculate totals
    const subtotal = cart.items?.reduce((total: number, item: any) => {
      const itemPrice = item.originalPrice || item.price
      const discountedPrice = item.discount ? itemPrice * (1 - item.discount / 100) : itemPrice
      return total + (discountedPrice * item.quantity)
    }, 0) || 0

    const freeShippingThreshold = (settings.taxShipping?.freeShippingThreshold || 50) * 100
    const defaultShippingCost = (settings.taxShipping?.defaultShippingCost || 5) * 100
    const taxRate = settings.taxShipping?.taxRate || 16
    
    const shipping = subtotal >= freeShippingThreshold ? 0 : defaultShippingCost
    const tax = Math.round(subtotal * (taxRate / 100))
    const total = subtotal + shipping + tax
    const itemCount = cart.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0

    return NextResponse.json({
      items: cart.items || [],
      totals: { subtotal, shipping, tax, total, itemCount },
      settings: {
        currency: settings.general?.currency || 'KSh',
        taxRate,
        freeShippingThreshold,
        defaultShippingCost
      }
    })
  } catch (error) {
    console.error("Modern Cart GET error:", error)
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 })
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const data = await request.json()
    const { productId, name, price, originalPrice, quantity, color, size, image, category, inStock, discount, variant } = data
    
    const userId = getUserIdFromRequest(request)
    console.log("🛒 Modern Cart POST - User ID:", userId)
    
    if (!productId || !name || !price || !quantity || !color || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (userId === "guest") {
      // Return success for guest users (handled by frontend)
      return NextResponse.json({
        success: true,
        item: { productId, name, price, originalPrice, quantity, color, size, image, category, inStock, discount, variant }
      })
    }    // Verify product exists and get latest data
    const product = await EyewearProduct.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = new Cart({ user: userId, items: [] })
    }

    // Generate unique item ID
    const itemId = `${productId}-${color}-${size || 'default'}`

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex((item: any) => 
      item.productId.toString() === productId && 
      item.color === color && 
      (item.size || 'default') === (size || 'default')
    )

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item with enhanced data
      cart.items.push({
        id: itemId,
        productId,
        name,
        price,
        originalPrice: originalPrice || price,
        quantity,
        color,
        size: size || undefined,
        image,
        category: category || product.category,
        inStock: inStock !== undefined ? inStock : product.inStock,
        discount: discount || product.discount,
        variant: variant || undefined
      })
    }

    await cart.save()
    await cart.populate('items.productId')
    
    return NextResponse.json({ items: cart.items })
  } catch (error) {
    console.error("Modern Cart POST error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

// PUT - Update cart item
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { itemId, quantity, priority, notes } = await request.json()
    const userId = getUserIdFromRequest(request)

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (userId === "guest") {
      return NextResponse.json({ success: true })
    }

    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const itemIndex = cart.items.findIndex((item: any) => item.id === itemId)
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1)
    } else {
      // Update item
      cart.items[itemIndex].quantity = quantity
      if (priority) cart.items[itemIndex].priority = priority
      if (notes !== undefined) cart.items[itemIndex].notes = notes
    }

    await cart.save()
    await cart.populate('items.productId')
    
    return NextResponse.json({ items: cart.items })
  } catch (error) {
    console.error("Modern Cart PUT error:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

// DELETE - Remove item from cart
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

    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    cart.items = cart.items.filter((item: any) => item.id !== itemId)
    await cart.save()
    await cart.populate('items.productId')
    
    return NextResponse.json({ items: cart.items })
  } catch (error) {
    console.error("Modern Cart DELETE error:", error)
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
  }
}
