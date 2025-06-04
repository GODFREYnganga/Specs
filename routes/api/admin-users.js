const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const { protect, adminOnly } = require("../../middleware/auth")

// @route   GET api/admin-users
// @desc    Get all admin users
// @access  Private/Admin
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }, "firstName lastName email")
    res.json(admins)
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

// @route   POST api/admin-users
// @desc    Add a new admin user
// @access  Private/Admin
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: "User already exists" })
    const user = new User({ firstName, lastName, email, password, role: "admin" })
    await user.save()
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// @route   DELETE api/admin-users/:id
// @desc    Remove an admin user
// @access  Private/Admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || user.role !== "admin") return res.status(404).json({ error: "Admin not found" })
    await user.remove()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
