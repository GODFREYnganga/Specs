import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
const User = require("../../../../models/User")
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user in database (users collection)
    const user = await User.findOne({ email }).select("+password +role +firstName +lastName")
    console.log("Login attempt for email:", email)
    console.log("User found:", user)
    if (!user) {
      return NextResponse.json({ error: "No user found with this email." }, { status: 401 })
    }
    if (user.role !== "admin") {
      return NextResponse.json({ error: "User is not an admin." }, { status: 401 })
    }
    // Verify password using model method
    const isMatch = await user.matchPassword(password)
    console.log("Password match:", isMatch)
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    )

    return NextResponse.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
