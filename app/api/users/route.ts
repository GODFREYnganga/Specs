import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const User = require("../../../models/User")

export async function GET() {
  await connectToDatabase()
  const users = await User.find()
  console.log('Users returned from DB:', users)
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const user = await User.create(data)
    return NextResponse.json(user, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add user" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    if (!data._id) return NextResponse.json({ error: "Missing user id" }, { status: 400 })
    const updated = await User.findByIdAndUpdate(data._id, data, { new: true, runValidators: true })
    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase()
    const { _id } = await request.json()
    if (!_id) return NextResponse.json({ error: "Missing user id" }, { status: 400 })
    const deleted = await User.findByIdAndDelete(_id)
    if (!deleted) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete user" }, { status: 500 })
  }
}
