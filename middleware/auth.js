const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Protect routes
exports.protect = async (req, res, next) => {
  let token

  // Check if auth header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1]
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ error: "Not authorized to access this route" })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")

    // Get user from the token
    req.user = await User.findById(decoded.id)

    next()
  } catch (err) {
    return res.status(401).json({ error: "Not authorized to access this route" })
  }
}

// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}
