import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    
    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const uploadedFiles: { name: string; url: string }[] = []
    const uploadDir = path.join(process.cwd(), "public", "images", "eyewear-products")
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true })

    for (const file of files) {
      if (file.size === 0) continue // Skip empty files
      
      const buffer = Buffer.from(await file.arrayBuffer())
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${originalName}`
      const filePath = path.join(uploadDir, filename)
      
      await fs.writeFile(filePath, buffer)
      
      const url = `/images/eyewear-products/${filename}`
      uploadedFiles.push({
        name: file.name,
        url
      })
    }

    return NextResponse.json({ 
      success: true,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} images`
    })

  } catch (error) {
    console.error("Bulk image upload error:", error)
    return NextResponse.json({ 
      error: "Failed to upload images",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
