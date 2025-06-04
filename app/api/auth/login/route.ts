import { NextResponse } from "next/server"
import type { User } from "@/types/user"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Find user in database
    // 2. Verify password hash
    // 3. Generate JWT token

    // Mock successful login (in a real app, this would check credentials)
    // For demo purposes, we'll just pretend any login works
    const mockUser: Partial<User> = {
      id: "user123",
      firstName: "John",
      lastName: "Doe",
      email,
    }

    return NextResponse.json({
      user: mockUser,
      token: "mock_jwt_token",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
