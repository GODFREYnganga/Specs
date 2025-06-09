import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`
  const uploadDir = path.join(process.cwd(), "public", "images", "products")
  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, filename)
  await fs.writeFile(filePath, buffer)
  const url = `/images/products/${filename}`
  return NextResponse.json({ url })
}
