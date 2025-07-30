import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import EyewearProduct from "@/models/EyewearProduct"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const { products } = await request.json()
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 })
    }
    // Validate and sanitize each product
    const sanitized = products.map((p) => ({
      sku: p.sku || '',
      stock: Number(p.stock) || 0,
      name: p.name || '',
      price: Number(p.price) || 0,
      category: p.category || '',
      image: p.image || '',
      description: p.description || '',
      inStock: p.inStock === 'true' || p.inStock === true,
      frameShape: p.frameShape || '',
      frameType: p.frameType || '',
      gender: p.gender || '',
      material: p.material || '',
      weight: p.weight || '',
      prescriptionType: p.prescriptionType || '',
      frameWidth: p.frameWidth || '',
      productType: p.productType || '',
      color: p.color || '',
      brand: p.brand || '',
      size: p.size || '',
      features: typeof p.features === 'string' ? p.features.split(',').map(f => f.trim()) : Array.isArray(p.features) ? p.features : [],
      colors: typeof p.colors === 'string' ? p.colors.split(',').map(c => c.trim()) : Array.isArray(p.colors) ? p.colors : [],
      images: p.images || '',
    }))    // Insert all products
    const result = await EyewearProduct.insertMany(sanitized)
    return NextResponse.json({ success: true, count: result.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
