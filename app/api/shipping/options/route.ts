import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Settings from "@/models/Settings"

// Get available shipping options
export async function GET() {
  try {
    await connectToDatabase()
    
    // Get settings to determine shipping options
    let settings = await Settings.findOne()
    
    if (!settings) {
      // Return default shipping options
      const defaultOptions = [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: 'Regular delivery within Nairobi and major cities',
          price: 500 * 100, // KSh 500 in cents
          estimatedDays: '3-5 business days',
          isDefault: true
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: 'Fast delivery within 1-2 business days',
          price: 1500 * 100, // KSh 1500 in cents
          estimatedDays: '1-2 business days',
          isDefault: false
        }
      ]
      
      return NextResponse.json(defaultOptions)
    }
    
    // Build shipping options based on settings
    const shippingOptions = []
    
    // Standard shipping
    shippingOptions.push({
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Regular delivery within Nairobi and major cities',
      price: settings.shippingSettings?.flatShippingRate || settings.shippingFlat || 500 * 100,
      estimatedDays: '3-5 business days',
      isDefault: true
    })
    
    // Express shipping (if enabled)
    if (settings.shippingSettings?.enableExpressShipping) {
      shippingOptions.push({
        id: 'express',
        name: 'Express Shipping',
        description: 'Fast delivery within 1-2 business days',
        price: settings.shippingSettings.expressShippingRate || 1500 * 100,
        estimatedDays: '1-2 business days',
        isDefault: false
      })
    }
    
    // Free shipping option (if enabled and threshold is met)
    if (settings.shippingSettings?.enableFreeShipping) {
      shippingOptions.unshift({
        id: 'free',
        name: 'Free Shipping',
        description: `Free delivery for orders over ${settings.currency || 'KSh'} ${((settings.shippingSettings.freeShippingThreshold || settings.freeShippingThreshold) / 100).toFixed(0)}`,
        price: 0,
        estimatedDays: '5-7 business days',
        isDefault: false
      })
    }
    
    // Same day delivery for Nairobi (premium option)
    shippingOptions.push({
      id: 'same-day',
      name: 'Same Day Delivery',
      description: 'Delivery within Nairobi CBD on the same day (order before 2 PM)',
      price: 2500 * 100, // KSh 2500 in cents
      estimatedDays: 'Same day',
      isDefault: false
    })
    
    return NextResponse.json(shippingOptions)
  } catch (error) {
    console.error("Shipping options GET error:", error)
    return NextResponse.json({ error: "Failed to fetch shipping options" }, { status: 500 })
  }
}
