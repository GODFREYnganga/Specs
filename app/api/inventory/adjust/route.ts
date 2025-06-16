import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"

// Adjust stock
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { productId, adjustment, reason } = await request.json()
    
    if (!productId || !adjustment || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Find the product
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    const previousStock = product.stock
    const newStock = Math.max(0, previousStock + adjustment)
    
    // Update product stock
    product.stock = newStock
    await product.save()
    
    // In a real implementation, you would also save this movement to a StockMovement collection
    // const stockMovement = new StockMovement({
    //   productId,
    //   productName: product.name,
    //   type: 'adjustment',
    //   quantity: adjustment,
    //   previousStock,
    //   newStock,
    //   reason,
    //   date: new Date(),
    //   user: 'Admin' // In real app, get from JWT token
    // })
    // await stockMovement.save()
    
    return NextResponse.json({ 
      success: true, 
      product: {
        ...product.toObject(),
        previousStock,
        newStock
      }
    })
  } catch (error) {
    console.error("Adjust stock error:", error)
    return NextResponse.json({ error: "Failed to adjust stock" }, { status: 500 })
  }
}
