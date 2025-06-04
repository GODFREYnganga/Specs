const express = require("express")
const router = express.Router()
const Order = require("../../models/Order")
const { protect } = require("../../middleware/auth")

// @route   GET api/orders
// @desc    Get all orders for a user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" })
    }

    res.json(order)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body

    // Validate input
    if (!items || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Create new order
    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
      status: "pending",
      shippingAddress,
      paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Save order
    const savedOrder = await newOrder.save()

    res.status(201).json(savedOrder)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   PUT api/orders/:id
// @desc    Update order status
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body

    // Find order
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" })
    }

    // Update status
    order.status = status
    order.updatedAt = new Date()

    // Save updated order
    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
