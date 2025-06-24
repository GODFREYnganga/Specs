const mongoose = require("mongoose")

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  maxQuantity: {
    type: Number,
  },
  discount: {
    type: Number,
    default: 0,
  },
  variant: {
    type: String,
  },
})

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Calculate cart totals
CartSchema.virtual("subtotal").get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
})

CartSchema.virtual("shipping").get(function() {
  const subtotal = this.subtotal
  return subtotal >= 5000 ? 0 : 500 // Free shipping over 5000 KSh
})

CartSchema.virtual("tax").get(function() {
  return Math.round(this.subtotal * 0.16) // 16% VAT
})

CartSchema.virtual("total").get(function() {
  return this.subtotal + this.shipping + this.tax
})

// Ensure virtual fields are serialized
CartSchema.set('toJSON', { virtuals: true })
CartSchema.set('toObject', { virtuals: true })

CartSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.models.Cart || mongoose.model("Cart", CartSchema)
