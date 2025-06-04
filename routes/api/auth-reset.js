const express = require("express")
const crypto = require("crypto")
const User = require("../../models/User")
const router = express.Router()
const nodemailer = require("nodemailer")

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: "Email is required" })
  const user = await User.findOne({ email })
  if (!user) return res.status(200).json({ message: "If that email exists, a reset link has been sent." })
  // Generate token
  const token = crypto.randomBytes(32).toString("hex")
  user.resetPasswordToken = token
  user.resetPasswordExpire = Date.now() + 1000 * 60 * 30 // 30 min
  await user.save()
  // Send email (configure your SMTP settings)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/reset-password/${token}`
  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset",
    html: `<p>Click <a href='${resetUrl}'>here</a> to reset your password. This link expires in 30 minutes.</p>`
  })
  res.json({ message: "If that email exists, a reset link has been sent." })
})

// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  if (!password) return res.status(400).json({ error: "Password is required" })
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  })
  if (!user) return res.status(400).json({ error: "Invalid or expired token" })
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()
  res.json({ message: "Password has been reset. You can now log in." })
})

module.exports = router
