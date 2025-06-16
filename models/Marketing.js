const mongoose = require("mongoose")

const MarketingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["email", "social", "ppc", "seo", "content", "affiliate", "display", "influencer"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["draft", "active", "paused", "completed", "cancelled"], 
    default: "draft" 
  },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
  
  // Campaign details
  description: { type: String },
  targetAudience: {
    ageRange: { type: String },
    gender: { type: String, enum: ["all", "male", "female", "other"] },
    location: [String],
    interests: [String]
  },
  
  // Performance metrics
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 }, // Click-through rate
    cpc: { type: Number, default: 0 }, // Cost per click
    roas: { type: Number, default: 0 }, // Return on ad spend
    cpa: { type: Number, default: 0 }  // Cost per acquisition
  },
  
  // Email specific
  emailData: {
    subject: { type: String },
    template: { type: String },
    openRate: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    unsubscribeRate: { type: Number, default: 0 }
  },
  
  // Coupon/Discount
  discountCode: { type: String },
  discountType: { type: String, enum: ["percentage", "fixed", "bogo"] },
  discountValue: { type: Number },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Calculate ROI automatically
MarketingSchema.methods.calculateROI = function() {
  if (this.spent === 0) return 0
  return ((this.metrics.revenue - this.spent) / this.spent) * 100
}

module.exports = mongoose.model("Marketing", MarketingSchema)
