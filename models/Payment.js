const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
  method: { type: String, enum: ["card", "mpesa", "paypal", "bank"], required: true },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Payment", PaymentSchema)
