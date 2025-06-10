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
    get: (imagePath) => `/images/products/${imagePath}`,
  },
  features: {
    type: [String],
    default: [],
  },
  colors: {
    type: [String],
    default: [],
  },
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
    enum: ["round", "square", "cat-eye", "aviator", "rectangle", "geometric", "wayfarer", "oval", "browline", "hexagonal", ""],
  },
  frameType: {
    type: String,
    enum: ["full-rim", "semi-rimless", "rimless", ""],
  },
  gender: {
    type: String,
    enum: ["unisex", "men", "women", "kids", ""],
  },
  material: {
    type: String,
    enum: ["acetate", "metal", "titanium", "plastic", "stainless steel", "tr90", "wood", "carbon fiber", ""],
  },
  weight: {
    type: String,
    enum: ["light", "medium", "heavy", ""],
  },
  prescriptionType: {
    type: String,
    enum: ["single-vision", "progressive", "bifocal", "non-prescription", "readers", ""],
  },
  frameWidth: {
    type: String,
    enum: ["narrow (less than 130mm)", "medium (130mm-139mm)", "wide (140mm and above)", ""],
  },
  productType: {
    type: String,
    enum: ["eyeglasses", "sunglasses", "blue-light", "reading-glasses", "fashion", ""],
  },
  brand: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    enum: ["small", "medium", "large", "extra large", ""],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Add index for search functionality
ProductSchema.index({ name: "text", description: "text", category: "text" })

// Check if the model already exists before defining it
module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema)
