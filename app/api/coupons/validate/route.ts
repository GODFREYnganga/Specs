import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Note: This is a basic coupon validation system
// In a real application, you would have a proper Coupons model
interface Coupon {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  expiresAt?: Date
  usageLimit?: number
  usedCount?: number
  isActive: boolean
}

// Sample coupons for demo purposes
const DEMO_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 1000 * 100, // KSh 1000 in cents
    isActive: true
  },
  {
    code: 'SAVE500',
    type: 'fixed',
    value: 500 * 100, // KSh 500 in cents
    minOrderAmount: 2000 * 100, // KSh 2000 in cents
    isActive: true
  },
  {
    code: 'FIRSTBUY',
    type: 'percentage',
    value: 15,
    minOrderAmount: 1500 * 100, // KSh 1500 in cents
    maxDiscount: 1000 * 100, // Max KSh 1000 discount
    isActive: true
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 500 * 100, // Covers standard shipping
    minOrderAmount: 1000 * 100,
    isActive: true
  },
  {
    code: 'BULK20',
    type: 'percentage',
    value: 20,
    minOrderAmount: 5000 * 100, // KSh 5000 in cents
    isActive: true
  }
]

// Validate a coupon code
export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json()
    
    if (!code || !cartTotal) {
      return NextResponse.json({ 
        error: "Coupon code and cart total are required" 
      }, { status: 400 })
    }
    
    // Find the coupon (in a real app, this would be a database query)
    const coupon = DEMO_COUPONS.find(c => 
      c.code.toLowerCase() === code.toLowerCase() && c.isActive
    )
    
    if (!coupon) {
      return NextResponse.json({ 
        error: "Invalid coupon code" 
      }, { status: 404 })
    }
    
    // Check if order meets minimum amount requirement
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount of KSh ${(coupon.minOrderAmount / 100).toFixed(0)} required for this coupon` 
      }, { status: 400 })
    }
    
    // Check if coupon has expired
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ 
        error: "This coupon has expired" 
      }, { status: 400 })
    }
    
    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ 
        error: "This coupon has reached its usage limit" 
      }, { status: 400 })
    }
    
    // Calculate discount amount
    let discountAmount = 0
    
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((cartTotal * coupon.value) / 100)
      
      // Apply maximum discount limit if specified
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value
      
      // Don't let discount exceed cart total
      if (discountAmount > cartTotal) {
        discountAmount = cartTotal
      }
    }
    
    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount
      },
      discountAmount,
      message: `Coupon applied! You saved KSh ${(discountAmount / 100).toFixed(2)}`
    })
    
  } catch (error) {
    console.error("Coupon validation error:", error)
    return NextResponse.json({ 
      error: "Failed to validate coupon" 
    }, { status: 500 })
  }
}

// Get available coupons (for admin or promotional display)
export async function GET() {
  try {
    // In a real app, you might filter this based on user permissions
    const activeCoupons = DEMO_COUPONS
      .filter(coupon => coupon.isActive)
      .map(coupon => ({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        description: getCouponDescription(coupon)
      }))
    
    return NextResponse.json(activeCoupons)
  } catch (error) {
    console.error("Coupons GET error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch coupons" 
    }, { status: 500 })
  }
}

function getCouponDescription(coupon: Coupon): string {
  let description = ""
  
  if (coupon.type === 'percentage') {
    description = `${coupon.value}% off`
    if (coupon.maxDiscount) {
      description += ` (max KSh ${(coupon.maxDiscount / 100).toFixed(0)})`
    }
  } else {
    description = `KSh ${(coupon.value / 100).toFixed(0)} off`
  }
  
  if (coupon.minOrderAmount) {
    description += ` on orders over KSh ${(coupon.minOrderAmount / 100).toFixed(0)}`
  }
  
  return description
}
