import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Marketing = require("../../../models/Marketing")

export async function GET() {
  await connectToDatabase()
  const marketing = await Marketing.find()
  return NextResponse.json(marketing)
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const marketing = await Marketing.create(data)
    return NextResponse.json(marketing, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add marketing" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    if (!data._id) return NextResponse.json({ error: "Missing marketing id" }, { status: 400 })
    const updated = await Marketing.findByIdAndUpdate(data._id, data, { new: true, runValidators: true })
    if (!updated) return NextResponse.json({ error: "Marketing not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update marketing" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase()
    const { _id } = await request.json()
    if (!_id) return NextResponse.json({ error: "Missing marketing id" }, { status: 400 })
    const deleted = await Marketing.findByIdAndDelete(_id)
    if (!deleted) return NextResponse.json({ error: "Marketing not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete marketing" }, { status: 500 })
  }
}
