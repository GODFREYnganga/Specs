import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Marketing = require("../../../models/Marketing")

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    
    // Build filter
    const filter: any = {}
    if (status) filter.status = status
    if (type) filter.type = type
    
    // Get campaigns with pagination
    const campaigns = await Marketing.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName email')
    
    // Get total count for pagination
    const total = await Marketing.countDocuments(filter)
    
    // Calculate aggregated metrics
    const stats = await Marketing.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: "$budget" },
          totalSpent: { $sum: "$spent" },
          totalRevenue: { $sum: "$metrics.revenue" },
          totalImpressions: { $sum: "$metrics.impressions" },
          totalClicks: { $sum: "$metrics.clicks" },
          totalConversions: { $sum: "$metrics.conversions" },
          activeCampaigns: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          }
        }
      }
    ])
    
    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || {
        totalBudget: 0,
        totalSpent: 0,
        totalRevenue: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        activeCampaigns: 0
      }
    })
  } catch (error) {
    console.error("Marketing GET error:", error)
    return NextResponse.json({ error: "Failed to fetch marketing campaigns" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 })
    }
    
    // Set default values
    const campaignData = {
      ...data,
      status: data.status || "draft",
      budget: data.budget || 0,
      spent: 0,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        ctr: 0,
        cpc: 0,
        roas: 0,
        cpa: 0
      }
    }
    
    const campaign = await Marketing.create(campaignData)
    await campaign.populate('createdBy', 'firstName lastName email')
    
    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error("Marketing POST error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to create marketing campaign" 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()
    const data = await request.json()
    
    if (!data._id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
    }
    
    // Calculate derived metrics if performance data is updated
    if (data.metrics) {
      const metrics = data.metrics
      if (metrics.impressions > 0) {
        metrics.ctr = (metrics.clicks / metrics.impressions) * 100
      }
      if (data.spent > 0) {
        metrics.cpc = data.spent / metrics.clicks || 0
        metrics.roas = (metrics.revenue / data.spent) * 100
        metrics.cpa = data.spent / metrics.conversions || 0
      }
    }
    
    const updated = await Marketing.findByIdAndUpdate(
      data._id, 
      { ...data, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email')
    
    if (!updated) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Marketing PUT error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to update marketing campaign" 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
    }
    
    const deleted = await Marketing.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: "Campaign deleted successfully" })
  } catch (error) {
    console.error("Marketing DELETE error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to delete marketing campaign" 
    }, { status: 500 })
  }
}
