import { NextResponse } from "next/server"
import type { User } from "@/types/user"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store in database
    // 4. Generate JWT token

    // Mock user creation
    const newUser: Partial<User> = {
      id: Math.random().toString(36).substring(2, 15),
      firstName,
      lastName,
      email,
    }

    // Mock successful response
    return NextResponse.json(
      {
        user: newUser,
        token: "mock_jwt_token",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
