import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const User = require("../../../models/User")
import bcrypt from "bcryptjs"

// GET: Get all admin users
export async function GET() {
  await connectToDatabase()
  const admins = await User.find({ role: "admin" }, "firstName lastName email")
  return NextResponse.json(admins)
}

// POST: Add a new admin user
export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { firstName, lastName, email, password } = await request.json()
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }
    // Do NOT hash password here, let pre-save hook handle it
    const user = await User.create({ firstName, lastName, email, password, role: "admin" })
    return NextResponse.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }, { status: 201 })
  } catch (err) {
    console.error("Failed to add admin user:", err)
    const message = err instanceof Error ? err.message : "Failed to add user"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE: Remove an admin user
export async function DELETE(request: Request) {
  await connectToDatabase()
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 })
  const user = await User.findById(id)
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin not found" }, { status: 404 })
  await user.remove()
  return NextResponse.json({ success: true })
}
