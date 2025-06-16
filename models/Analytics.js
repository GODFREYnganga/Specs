const mongoose = require("mongoose")

const AnalyticsSchema = new mongoose.Schema({
  // Event tracking
  eventType: { 
    type: String, 
    enum: ["page_view", "product_view", "add_to_cart", "purchase", "search", "signup", "login", "email_open", "click"], 
    required: true 
  },
  eventData: {
    page: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String },
    value: { type: Number }, // Revenue for purchases, price for product views, etc.
    metadata: { type: mongoose.Schema.Types.Mixed } // Additional data
  },
  
  // Time-based data
  timestamp: { type: Date, default: Date.now },
  date: { type: String }, // YYYY-MM-DD for easy aggregation
  hour: { type: Number }, // 0-23 for hourly analysis
  dayOfWeek: { type: Number }, // 0-6 for weekly patterns
  
  // Device/Source tracking
  deviceType: { type: String, enum: ["desktop", "mobile", "tablet"] },
  browser: { type: String },
  os: { type: String },
  source: { type: String }, // organic, paid, social, email, direct
  medium: { type: String }, // cpc, email, social, organic
  campaign: { type: String },
  
  // Geographic data
  country: { type: String },
  city: { type: String },
  ipAddress: { type: String },
  
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Aggregated metrics schema for faster reporting
const MetricsSchema = new mongoose.Schema({
  period: { type: String, required: true }, // daily, weekly, monthly
  date: { type: String, required: true }, // YYYY-MM-DD, YYYY-MM, etc.
  
  // Website metrics
  pageViews: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  sessions: { type: Number, default: 0 },
  bounceRate: { type: Number, default: 0 },
  avgSessionDuration: { type: Number, default: 0 },
  
  // E-commerce metrics
  orders: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  avgOrderValue: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
  
  // Product metrics
  topProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    views: { type: Number },
    sales: { type: Number },
    revenue: { type: Number }
  }],
  
  // Traffic sources
  trafficSources: [{
    source: { type: String },
    visitors: { type: Number },
    conversions: { type: Number }
  }],
  
  // User demographics
  demographics: {
    newUsers: { type: Number, default: 0 },
    returningUsers: { type: Number, default: 0 },
    devices: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 }
    }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Add indexes for better performance
AnalyticsSchema.index({ eventType: 1, date: 1 })
AnalyticsSchema.index({ userId: 1, timestamp: -1 })
AnalyticsSchema.index({ productId: 1, eventType: 1 })

MetricsSchema.index({ period: 1, date: 1 })

const Analytics = mongoose.model("Analytics", AnalyticsSchema)
const Metrics = mongoose.model("Metrics", MetricsSchema)

module.exports = { Analytics, Metrics }
