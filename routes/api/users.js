const express = require("express")
const router = express.Router()
const User = require("../../models/User")

// @route   GET api/users
// @desc    Get all users
// @access  Private (should be protected in production)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "firstName lastName email")
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
