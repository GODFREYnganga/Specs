const { connectToDatabase } = require("./lib/mongodb");

(async () => {
  try {
    const db = await connectToDatabase();
    console.log("Database connected successfully:", db.connection.name);
    process.exit(0);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
})();
