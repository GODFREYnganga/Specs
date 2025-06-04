const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
    min: [0, "Price must be a positive number"],
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  category: {
    type: String,
    required: [true, "Please provide product category"],
    enum: ["prescription", "sunglasses", "reading", "blue-light", "fashion"],
  },
  image: {
    type: String,
    required: [true, "Please provide product image"],
  },
  features: [String],
  colors: [String],
  images: [String],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  frameShape: {
    type: String,
    enum: ["round", "square", "cat-eye", "aviator", "rectangle", "geometric", ""],
  },
  frameType: {
    type: String,
    enum: ["full-rim", "semi-rimless", "rimless", ""],
  },
  gender: {
    type: String,
    enum: ["men", "women", "unisex", ""],
  },
  material: {
    type: String,
    enum: ["acetate", "metal", "plastic", "titanium", ""],
  },
  weight: {
    type: String,
    enum: ["light", "medium", "heavy", ""],
  },
  prescriptionType: {
    type: String,
    enum: ["single-vision", "progressive", "reading", "non-prescription", "blue-light", ""],
  },
  frameWidth: {
    type: String,
    enum: ["narrow", "medium", "wide", ""],
  },
  productType: {
    type: String,
    enum: ["eyeglasses", "sunglasses", "reading-glasses", "blue-light", ""],
  },
  brand: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    enum: ["small", "medium", "large", ""],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Add index for search functionality
ProductSchema.index({ name: "text", description: "text", category: "text" })

module.exports = mongoose.model("Product", ProductSchema)
