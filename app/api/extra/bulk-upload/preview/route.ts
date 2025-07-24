import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Read Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0] // Get first sheet
    const worksheet = workbook.Sheets[sheetName]

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    // Preview only first 10 rows
    const preview = jsonData.slice(0, 10).map((row: any) => ({
      name: row.Name || row.name || '',
      price: row.Price || row.price || 0,
      category: row.Category || row.category || '',
      description: row.Description || row.description || '',
      brand: row.Brand || row.brand || '',
      color: row.Color || row.color || '',
      material: row.Material || row.material || '',
      frameType: row.FrameType || row.frameType || '',
      lensType: row.LensType || row.lensType || '',
      inStock: row.InStock || row.inStock || 0,
      sku: row.SKU || row.sku || '',
      images: row.Images || row.images || ''
    }))

    return NextResponse.json({
      preview,
      totalRows: jsonData.length,
      message: `Found ${jsonData.length} products in the Excel file`
    })
  } catch (error) {
    console.error("Preview error:", error)
    return NextResponse.json({ error: "Failed to preview file" }, { status: 500 })
  }
}
