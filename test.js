const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const DB_NAME = "Store";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
}, { collection: "users" });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log("Connected to MongoDB!");
    // Try to find one admin user
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      console.log("Found admin user:", admin.email);
    } else {
      console.log("No admin user found in users collection.");
    }
    mongoose.connection.close();
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

testConnection();
