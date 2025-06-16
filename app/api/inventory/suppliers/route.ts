import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Get suppliers
export async function GET() {
  try {
    await connectToDatabase()
    
    // Mock suppliers data - in real implementation, fetch from Supplier model
    const mockSuppliers = [
      {
        _id: "sup1",
        name: "EyeWear Solutions Ltd",
        email: "contact@eyewearsolutions.com",
        phone: "+254 700 123 456",
        products: ["Urban Classic", "Sunset Aviator"],
        status: "active"
      },
      {
        _id: "sup2", 
        name: "Vision Tech Supplies",
        email: "orders@visiontech.co.ke",
        phone: "+254 722 789 012",
        products: ["Reading Pro", "Digital Shield"],
        status: "active"
      },
      {
        _id: "sup3",
        name: "Premium Optics Kenya",
        email: "sales@premiumoptics.ke",
        phone: "+254 733 456 789",
        products: ["Classic Wayfarer", "Modern Square"],
        status: "active"
      }
    ]
    
    return NextResponse.json(mockSuppliers)
  } catch (error) {
    console.error("Get suppliers error:", error)
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

// Add new supplier
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { name, email, phone } = await request.json()
    
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // In real implementation, create new Supplier document
    // const supplier = new Supplier({
    //   name,
    //   email,
    //   phone,
    //   products: [],
    //   status: 'active'
    // })
    // await supplier.save()
    
    const newSupplier = {
      _id: `sup${Date.now()}`,
      name,
      email,
      phone,
      products: [],
      status: "active"
    }
    
    return NextResponse.json({ 
      success: true, 
      supplier: newSupplier
    })
  } catch (error) {
    console.error("Add supplier error:", error)
    return NextResponse.json({ error: "Failed to add supplier" }, { status: 500 })
  }
}
