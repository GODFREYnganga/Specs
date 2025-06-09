const mongoose = require("mongoose")

const MarketingSchema = new mongoose.Schema({
  campaign: { type: String, required: true },
  status: { type: String, enum: ["active", "paused", "completed"], default: "active" },
  budget: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Marketing", MarketingSchema)
