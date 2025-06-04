import { NextResponse } from "next/server"
import type { CartItem, Cart } from "@/types/cart"

// In a real app, this would be stored in a database or session
let cartItems: CartItem[] = []

export async function GET() {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.07 // 7% tax
  const total = subtotal + shipping + tax

  const cart: Cart = {
    items: cartItems,
    subtotal,
    tax,
    shipping,
    total,
  }

  return NextResponse.json(cart)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, name, price, color, quantity, image } = body

    // Validate input
    if (!id || !name || !price || !color || !quantity || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex((item) => item.id === id && item.color === color)

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cartItems[existingItemIndex].quantity += quantity
    } else {
      // Add new item to cart
      cartItems.push({
        id,
        name,
        price,
        color,
        quantity,
        image,
      })
    }

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = 0 // Free shipping
    const tax = subtotal * 0.07 // 7% tax
    const total = subtotal + shipping + tax

    const cart: Cart = {
      items: cartItems,
      subtotal,
      tax,
      shipping,
      total,
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, color, quantity } = body

    // Validate input
    if (!id || !color || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the item in the cart
    const itemIndex = cartItems.findIndex((item) => item.id === id && item.color === color)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cartItems = cartItems.filter((_, index) => index !== itemIndex)
    } else {
      // Update quantity
      cartItems[itemIndex].quantity = quantity
    }

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = 0 // Free shipping
    const tax = subtotal * 0.07 // 7% tax
    const total = subtotal + shipping + tax

    const cart: Cart = {
      items: cartItems,
      subtotal,
      tax,
      shipping,
      total,
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const color = searchParams.get("color")

  if (!id || !color) {
    return NextResponse.json({ error: "Product ID and color are required" }, { status: 400 })
  }

  // Remove item from cart
  cartItems = cartItems.filter((item) => !(item.id.toString() === id && item.color === color))

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.07 // 7% tax
  const total = subtotal + shipping + tax

  const cart: Cart = {
    items: cartItems,
    subtotal,
    tax,
    shipping,
    total,
  }

  return NextResponse.json(cart)
}
