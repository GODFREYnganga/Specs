const mongoose = require("mongoose")

const ShippingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  carrier: { type: String, required: true },
  trackingNumber: { type: String },
  status: { type: String, enum: ["pending", "shipped", "in_transit", "delivered", "cancelled"], default: "pending" },
  estimatedDelivery: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Shipping", ShippingSchema)
