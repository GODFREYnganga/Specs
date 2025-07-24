import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { connectToDatabase } from "@/lib/mongodb"
import Product from "@/models/Product"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Read Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' })

    let allProcessedProducts = []
    let successCount = 0
    let errorCount = 0
    const errors: any[] = []

    // Process all sheets
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      console.log(`Processing sheet: ${sheetName} with ${jsonData.length} rows`)

      // Process each row
      for (let i = 0; i < jsonData.length; i++) {
        const row: any = jsonData[i]

        try {
          // Map Excel columns to Product model fields
          const productData = {
            name: row.Name || row.name || `Product ${i + 1}`,
            price: parseFloat(row.Price || row.price || 0),
            category: row.Category || row.category || 'eyewear',
            description: row.Description || row.description || '',
            brand: row.Brand || row.brand || '',
            color: row.Color || row.color || '',
            material: row.Material || row.material || '',
            frameType: row.FrameType || row.frameType || '',
            lensType: row.LensType || row.lensType || '',
            inStock: parseInt(row.InStock || row.inStock || 0),
            sku: row.SKU || row.sku || `SKU-${Date.now()}-${i}`,
            images: row.Images || row.images ? (row.Images || row.images).split(',').map((img: string) => img.trim()) : ['/placeholder.svg'],

            // Additional fields
            weight: parseFloat(row.Weight || row.weight || 0),
            dimensions: {
              width: parseFloat(row.Width || row.width || 0),
              height: parseFloat(row.Height || row.height || 0),
              depth: parseFloat(row.Depth || row.depth || 0)
            },

            // Default values
            featured: false,
            discount: parseFloat(row.Discount || row.discount || 0),
            tags: row.Tags || row.tags ? (row.Tags || row.tags).split(',').map((tag: string) => tag.trim()) : [],
            rating: parseFloat(row.Rating || row.rating || 0),
            reviews: parseInt(row.Reviews || row.reviews || 0),

            // Metadata
            createdAt: new Date(),
            updatedAt: new Date()
          }

          // Validate required fields
          if (!productData.name || productData.price <= 0) {
            errors.push({
              row: i + 1,
              sheet: sheetName,
              error: 'Missing required fields (name or price)',
              data: productData
            })
            errorCount++
            continue
          }

          // Check if product already exists (by SKU)
          const existingProduct = await Product.findOne({ sku: productData.sku })

          if (existingProduct) {
            // Update existing product
            await Product.findByIdAndUpdate(existingProduct._id, productData)
            allProcessedProducts.push({ ...productData, action: 'updated' })
          } else {
            // Create new product
            const newProduct = new Product(productData)
            await newProduct.save()
            allProcessedProducts.push({ ...productData, action: 'created' })
          }

          successCount++

        } catch (error) {
          console.error(`Error processing row ${i + 1}:`, error)
          errors.push({
            row: i + 1,
            sheet: sheetName,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: row
          })
          errorCount++
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: successCount,
      errors: errorCount,
      total: successCount + errorCount,
      errorDetails: errors,
      message: `Successfully processed ${successCount} products. ${errorCount} errors occurred.`
    })

  } catch (error) {
    console.error("Bulk upload error:", error)
    return NextResponse.json({
      error: "Failed to process bulk upload",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
