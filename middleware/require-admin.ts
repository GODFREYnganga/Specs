import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
const User = require("@/../models/User")

export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token) return NextResponse.redirect("/login")
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")
    await connectToDatabase()
    const user = await User.findById(decoded.id)
    if (!user || user.role !== "admin") {
      return NextResponse.redirect("/login")
    }
    return null // allow
  } catch {
    return NextResponse.redirect("/login")
  }
}
