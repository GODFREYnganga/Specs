import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "../../../../models/User"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user in database
    const user = await User.findOne({ email }).select("+password +role +firstName +lastName")
    
    if (!user) {
      return NextResponse.json({ error: "No user found with this email." }, { status: 401 })
    }

    // Verify password using model method
    const isMatch = await user.matchPassword(password)
    
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
    }

    // Generate JWT token for regular users
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
      token
    })
  } catch (error) {
    console.error("User login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
