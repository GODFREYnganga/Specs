const express = require("express")
const router = express.Router()

// In a real app, this would be stored in a database or session
let cartItems = []

// @route   GET api/cart
// @desc    Get cart items
// @access  Public (would be Private in a real app)
router.get("/", (req, res) => {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.07 // 7% tax
  const total = subtotal + shipping + tax

  const cart = {
    items: cartItems,
    subtotal,
    tax,
    shipping,
    total,
  }

  res.json(cart)
})

// @route   POST api/cart
// @desc    Add item to cart
// @access  Public (would be Private in a real app)
router.post("/", (req, res) => {
  try {
    const { id, name, price, color, quantity, image } = req.body

    // Validate input
    if (!id || !name || !price || !color || !quantity || !image) {
      return res.status(400).json({ error: "Missing required fields" })
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

    const cart = {
      items: cartItems,
      subtotal,
      tax,
      shipping,
      total,
    }

    res.json(cart)
  } catch (error) {
    console.error("Add to cart error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// @route   PUT api/cart
// @desc    Update cart item quantity
// @access  Public (would be Private in a real app)
router.put("/", (req, res) => {
  try {
    const { id, color, quantity } = req.body

    // Validate input
    if (!id || !color || quantity === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Find the item in the cart
    const itemIndex = cartItems.findIndex((item) => item.id === id && item.color === color)

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" })
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

    const cart = {
      items: cartItems,
      subtotal,
      tax,
      shipping,
      total,
    }

    res.json(cart)
  } catch (error) {
    console.error("Update cart error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// @route   DELETE api/cart
// @desc    Remove item from cart
// @access  Public (would be Private in a real app)
router.delete("/", (req, res) => {
  const { id, color } = req.query

  if (!id || !color) {
    return res.status(400).json({ error: "Product ID and color are required" })
  }

  // Remove item from cart
  cartItems = cartItems.filter((item) => !(item.id.toString() === id && item.color === color))

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.07 // 7% tax
  const total = subtotal + shipping + tax

  const cart = {
    items: cartItems,
    subtotal,
    tax,
    shipping,
    total,
  }

  res.json(cart)
})

module.exports = router
