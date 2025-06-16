import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Analytics, Metrics } = require("../../../models/Analytics")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Product = require("../../../models/Product")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Order = require("../../../models/Order")

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "daily" // daily, weekly, monthly
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const type = searchParams.get("type") // overview, traffic, sales, products, users
    
    const now = new Date()
    const defaultStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    
    const start = startDate ? new Date(startDate) : defaultStart
    const end = endDate ? new Date(endDate) : now
    
    // Build date filter
    const dateFilter = {
      timestamp: {
        $gte: start,
        $lte: end
      }
    }
    
    switch (type) {
      case "overview":
        return NextResponse.json(await getOverviewMetrics(dateFilter))
      
      case "traffic":
        return NextResponse.json(await getTrafficMetrics(dateFilter, period))
      
      case "sales":
        return NextResponse.json(await getSalesMetrics(dateFilter, period))
      
      case "products":
        return NextResponse.json(await getProductMetrics(dateFilter))
      
      case "users":
        return NextResponse.json(await getUserMetrics(dateFilter, period))
        default:
        // Return comprehensive dashboard data
        const comprehensiveData = {
          overview: await getOverviewMetrics(dateFilter),
          traffic: await getTrafficMetrics(dateFilter, period),
          sales: await getSalesMetrics(dateFilter, period),
          topProducts: await getProductMetrics(dateFilter),
          recentEvents: await getRecentEvents(dateFilter)
        }
        
        return NextResponse.json(comprehensiveData)
        const [overview, traffic, sales, topProducts, recentEvents] = await Promise.all([
          getOverviewMetrics(dateFilter),
          getTrafficMetrics(dateFilter, "daily"),
          getSalesMetrics(dateFilter, "daily"),
          getTopProducts(dateFilter),
          getRecentEvents(10)
        ])
        
        return NextResponse.json({
          overview,
          traffic,
          sales,
          topProducts,
          recentEvents
        })
    }
  } catch (error) {
    console.error("Analytics GET error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

// Track new analytics event
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const data = await request.json()
    
    if (!data.eventType) {
      return NextResponse.json({ error: "Event type is required" }, { status: 400 })
    }
    
    // Add derived fields
    const now = new Date()
    const eventData = {
      ...data,
      timestamp: now,
      date: now.toISOString().split('T')[0],
      hour: now.getHours(),
      dayOfWeek: now.getDay()
    }
    
    const event = await Analytics.create(eventData)
    
    // Update real-time metrics if needed
    await updateRealTimeMetrics(eventData)
    
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Analytics POST error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to track analytics event" 
    }, { status: 500 })
  }
}

// Helper functions for aggregating data
async function getOverviewMetrics(dateFilter: any) {
  const [
    pageViews,
    uniqueVisitors,
    orders,
    revenue,
    conversionEvents,
    totalEvents
  ] = await Promise.all([
    Analytics.countDocuments({ ...dateFilter, eventType: "page_view" }),
    Analytics.distinct("eventData.sessionId", { ...dateFilter, eventType: "page_view" }).then(sessions => sessions.length),
    Analytics.countDocuments({ ...dateFilter, eventType: "purchase" }),
    Analytics.aggregate([
      { $match: { ...dateFilter, eventType: "purchase" } },
      { $group: { _id: null, total: { $sum: "$eventData.value" } } }
    ]).then(result => result[0]?.total || 0),
    Analytics.countDocuments({ ...dateFilter, eventType: "add_to_cart" }),
    Analytics.countDocuments(dateFilter)
  ])
  
  const conversionRate = pageViews > 0 ? ((orders / pageViews) * 100).toFixed(2) : 0
  const avgOrderValue = orders > 0 ? (revenue / orders).toFixed(2) : 0
  
  return {
    pageViews,
    uniqueVisitors,
    orders,
    revenue: parseFloat(revenue.toFixed(2)),
    conversionRate: parseFloat(conversionRate.toString()),
    avgOrderValue: parseFloat(avgOrderValue.toString()),
    addToCarts: conversionEvents,
    totalEvents
  }
}

async function getTrafficMetrics(dateFilter: any, period: string) {
  const groupBy = period === "daily" 
    ? { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
    : period === "weekly"
    ? { $dateToString: { format: "%Y-W%U", date: "$timestamp" } }
    : { $dateToString: { format: "%Y-%m", date: "$timestamp" } }
  
  const trafficData = await Analytics.aggregate([
    { $match: { ...dateFilter, eventType: "page_view" } },
    {
      $group: {
        _id: groupBy,
        pageViews: { $sum: 1 },
        uniqueVisitors: { $addToSet: "$eventData.sessionId" }
      }
    },
    {
      $project: {
        date: "$_id",
        pageViews: 1,
        uniqueVisitors: { $size: "$uniqueVisitors" }
      }
    },
    { $sort: { date: 1 } }
  ])
  
  // Traffic sources
  const sources = await Analytics.aggregate([
    { $match: { ...dateFilter, eventType: "page_view" } },
    {
      $group: {
        _id: "$source",
        visitors: { $addToSet: "$eventData.sessionId" },
        pageViews: { $sum: 1 }
      }
    },
    {
      $project: {
        source: "$_id",
        visitors: { $size: "$visitors" },
        pageViews: 1
      }
    },
    { $sort: { visitors: -1 } }
  ])
  
  return { trafficData, sources }
}

async function getSalesMetrics(dateFilter: any, period: string) {
  const groupBy = period === "daily" 
    ? { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
    : period === "weekly"
    ? { $dateToString: { format: "%Y-W%U", date: "$timestamp" } }
    : { $dateToString: { format: "%Y-%m", date: "$timestamp" } }
  
  const salesData = await Analytics.aggregate([
    { $match: { ...dateFilter, eventType: "purchase" } },
    {
      $group: {
        _id: groupBy,
        revenue: { $sum: "$eventData.value" },
        orders: { $sum: 1 },
        customers: { $addToSet: "$eventData.userId" }
      }
    },
    {
      $project: {
        date: "$_id",
        revenue: 1,
        orders: 1,
        customers: { $size: "$customers" },
        avgOrderValue: { $divide: ["$revenue", "$orders"] }
      }
    },
    { $sort: { date: 1 } }
  ])
  
  return salesData
}

async function getProductMetrics(dateFilter: any) {
  const topViewed = await Analytics.aggregate([
    { $match: { ...dateFilter, eventType: "product_view" } },
    {
      $group: {
        _id: "$eventData.productId",
        views: { $sum: 1 },
        uniqueViewers: { $addToSet: "$eventData.sessionId" }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$_id",
        name: "$product.name",
        price: "$product.price",
        views: 1,
        uniqueViewers: { $size: "$uniqueViewers" }
      }
    },
    { $sort: { views: -1 } },
    { $limit: 10 }
  ])
  
  const topSelling = await Analytics.aggregate([
    { $match: { ...dateFilter, eventType: "purchase" } },
    {
      $group: {
        _id: "$eventData.productId",
        sales: { $sum: 1 },
        revenue: { $sum: "$eventData.value" }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$_id",
        name: "$product.name",
        sales: 1,
        revenue: 1
      }
    },
    { $sort: { sales: -1 } },
    { $limit: 10 }
  ])
  
  return { topViewed, topSelling }
}

async function getUserMetrics(dateFilter: any, period: string) {
  const newUsers = await Analytics.countDocuments({
    ...dateFilter,
    eventType: "signup"
  })
  
  const returningUsers = await Analytics.aggregate([
    { $match: { ...dateFilter, eventType: "page_view" } },
    {
      $group: {
        _id: "$eventData.userId",
        sessions: { $addToSet: "$eventData.sessionId" }
      }
    },
    {
      $match: {
        _id: { $ne: null },
        "sessions.1": { $exists: true } // More than 1 session
      }
    },
    { $count: "returningUsers" }
  ])
  
  // Device breakdown
  const deviceStats = await Analytics.aggregate([
    { $match: { ...dateFilter, eventType: "page_view" } },
    {
      $group: {
        _id: "$deviceType",
        users: { $addToSet: "$eventData.sessionId" }
      }
    },
    {
      $project: {
        device: "$_id",
        users: { $size: "$users" }
      }
    }
  ])
  
  return {
    newUsers,
    returningUsers: returningUsers[0]?.returningUsers || 0,
    deviceStats
  }
}

async function getTopProducts(dateFilter: any) {
  return await Analytics.aggregate([
    { $match: { ...dateFilter, eventType: "product_view" } },
    {
      $group: {
        _id: "$eventData.productId",
        views: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        name: "$product.name",
        views: 1
      }
    },
    { $sort: { views: -1 } },
    { $limit: 5 }
  ])
}

async function getRecentEvents(limit: number) {
  return await Analytics.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('eventData.productId', 'name')
    .populate('eventData.userId', 'firstName lastName')
}

async function updateRealTimeMetrics(eventData: any) {
  // Update daily metrics
  const today = eventData.date
  
  const updateData: any = {}
  
  switch (eventData.eventType) {
    case "page_view":
      updateData.$inc = { pageViews: 1 }
      break
    case "purchase":
      updateData.$inc = { 
        orders: 1, 
        revenue: eventData.eventData.value || 0 
      }
      break
  }
  
  if (Object.keys(updateData).length > 0) {
    await Metrics.findOneAndUpdate(
      { period: "daily", date: today },
      updateData,
      { upsert: true, new: true }
    )
  }
}
