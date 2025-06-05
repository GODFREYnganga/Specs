import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
const User = require("../../../../models/User")
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Do NOT hash the password here, let pre-save hook handle it
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: "admin", // or "user" if you want normal signup
    })

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" },
    )

    // Respond with the created user and token
    return NextResponse.json(
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
