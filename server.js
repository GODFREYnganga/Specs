simple broconst express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Define routes
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/auth", require("./routes/api/auth-reset"))
app.use("/api/products", require("./routes/api/products"))
app.use("/api/cart", require("./routes/api/cart"))
app.use("/api/orders", require("./routes/api/orders"))
app.use("/api/users", require("./routes/api/users"))
app.use("/api/admin-users", require("./routes/api/admin-users"))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB Connected...")
  } catch (err) {
    console.error("MongoDB connection error:", err.message)
    // Exit process with failure
    process.exit(1)
  }
}

// Connect to database
connectDB()

// Use PORT from environment variable or default to 5000
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
