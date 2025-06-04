// This file has been deprecated and is no longer needed. All product management is now handled via the admin dashboard and MongoDB.

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Urban Classic",
    price: 12999,
    category: "prescription",
    image: "/images/products/gold-round-frames.png",
    description: "Timeless design with modern comfort",
    features: [
      "Premium acetate material",
      "Spring hinges for comfort",
      "Anti-scratch coating",
      "UV protection",
      "Includes hard case and cleaning cloth",
    ],
    colors: ["Black", "Tortoise", "Crystal"],
    images: [
      "/images/products/gold-round-frames.png",
      "/images/products/blue-round-frames.png",
      "/images/products/black-round-frames.png",
    ],
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    name: "Sunset Aviator",
    price: 14999,
    category: "sunglasses",
    image: "/images/products/blue-round-frames.png",
    description: "UV protection with style",
    features: [
      "Polarized lenses",
      "100% UV protection",
      "Lightweight metal frame",
      "Adjustable nose pads",
      "Includes case and microfiber cloth",
    ],
    colors: ["Gold", "Silver", "Black"],
    images: [
      "/images/products/blue-round-frames.png",
      "/images/products/gold-round-frames.png",
      "/images/products/black-round-frames.png",
    ],
    rating: 4.6,
    reviews: 98,
    inStock: true,
  },
  {
    name: "Reading Pro",
    price: 10999,
    category: "reading",
    image: "/images/products/black-round-frames.png",
    description: "Comfortable frames for extended reading",
    features: [
      "Blue light filtering",
      "Anti-glare coating",
      "Lightweight frame",
      "Spring hinges",
      "Multiple magnification options",
    ],
    colors: ["Black", "Brown", "Blue"],
    images: [
      "/images/products/black-round-frames.png",
      "/images/products/blue-round-frames.png",
      "/images/products/gold-round-frames.png",
    ],
    rating: 4.5,
    reviews: 76,
    inStock: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Database seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
