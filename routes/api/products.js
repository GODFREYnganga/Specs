const express = require("express")
const router = express.Router()
const Product = require("../../models/Product")

// @route   GET api/products
// @desc    Get all products (optionally filter by category)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}
    const products = await Product.find(filter)
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

// @route   POST api/products
// @desc    Add a new product
// @access  Public (should be protected in production)
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Public (should be protected in production)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).json({ error: "Product not found" })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
