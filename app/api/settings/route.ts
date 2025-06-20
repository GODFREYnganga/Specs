import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Settings = require("../../../models/Settings")
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function GET() {
  try {
    await connectToDatabase()
    const settings = await Settings.getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings GET error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const formData = await request.formData()
    const updateData: any = {}
    
    // Handle logo upload
    const logoFile = formData.get("storeLogo") as File | null
    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadsDir = path.join(process.cwd(), "public", "uploads")
      await mkdir(uploadsDir, { recursive: true })
      
      const fileName = `logo-${Date.now()}-${logoFile.name}`
      const filePath = path.join(uploadsDir, fileName)
      await writeFile(filePath, buffer)
      
      updateData.storeLogo = `/uploads/${fileName}`
    }
    
    // Handle other form fields
    for (const [key, value] of formData.entries()) {
      if (key === "storeLogo") continue // Already handled above

      if (key.includes(".")) {
        // Always use MongoDB dot notation for nested fields
        updateData[key] = value === "true" ? true : value === "false" ? false : value
      } else {
        // Handle simple fields
        if (key === "taxRate" || key === "defaultShippingCost" || key === "freeShippingThreshold") {
          updateData[key] = parseFloat(value as string) || 0
        } else if (key === "maintenanceMode") {
          updateData[key] = value === "true"
        } else {
          updateData[key] = value
        }
      }
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    )

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings PUT error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
