import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { cookies } from "next/headers"
const User = require("../../../../models/User")
import jwt from "jsonwebtoken"

export async function GET(request: Request) {
  try {
    await connectToDatabase()
    
    // Check for token in Authorization header (for regular users)
    const authHeader = request.headers.get("authorization")
    let token = null
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]
    } else {
      // Check for HTTP-only cookie (for admin users)
      const cookieStore = await cookies()
      token = cookieStore.get ? cookieStore.get("token")?.value : undefined
    }
    
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    return NextResponse.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to fetch user" }, { status: 500 })
  }
}
