import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "<YOUR_MONGODB_URI_HERE>";
const DB_NAME = "Store";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  console.log("Connecting to database..."); // Log connection attempt
  if (cached.conn) {
    console.log("Using cached database connection.");
    return cached.conn;
  }
  if (!cached.promise) {
    console.log("Creating new database connection...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME, // Ensure the database name is set to 'Store'
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("Database connection established.");
      return mongoose;
    }).catch((err) => {
      console.error("Database connection failed:", err);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

(global as any).mongoose = cached;
