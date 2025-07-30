import mongoose from "mongoose"

const EyewearProductSchema = new mongoose.Schema({
  // Core required fields
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  
  // Excel template fields - exactly matching the template columns
  brand_name: { type: String, trim: true },
  product_title: { type: String, trim: true },
  product_description: { type: String },
  print_name: { type: String, trim: true },
  product_type: { type: String, trim: true },
  sku: { type: String, trim: true },
  barcode: { type: String, trim: true },
  color_code: { type: String, trim: true },
  color: { type: String, trim: true },
  category: { type: String, trim: true },
  weight: { type: String, trim: true },
  size: { type: String, trim: true },
  material: { type: String, trim: true },
  shape: { type: String, trim: true },
  frame_dimension: { type: String, trim: true },
  frame_type: { type: String, trim: true },
  gender: { type: String, trim: true },
  weight_group: { type: String, trim: true },
  age_group: { type: String, trim: true },
  frame_width: { type: String, trim: true },
  lenses_supported: { type: String, trim: true },
  collection_type: { type: String, trim: true },
  unit: { type: String, trim: true },
  tags: { type: [String], default: [] },
  tax: { type: String, trim: true },
  start_qty: { type: Number, default: 0 },
  sale_price: { type: Number, default: 0 },
  mrp: { type: Number, default: 0 },
  
  // Image fields - with automatic path processing
  image: { type: String }, // Main image (IMAGE 1)
  images: { type: [String], default: [] }, // Array of all image URLs
  
  // Technical information fields
  short_technical_information: { type: String },
  long_technical_information: { type: String },
  
  // Publishing and display fields
  publish: { type: String, trim: true },
  show_on_website: { type: String, trim: true },
  where_to_show: { type: String, trim: true },
  
  // Sales and marketing fields
  incentive_for_salesman: { type: String, trim: true },
  loyalty_pts: { type: String, trim: true },
  related_products: { type: [String], default: [] },
  
  // SEO fields
  keywords: { type: String, trim: true },
  meta_description: { type: String, trim: true },
  meta_title: { type: String, trim: true },
  
  // Legacy compatibility fields
  title: { type: String, trim: true },
  brandName: { type: String, trim: true },
  printName: { type: String, trim: true },
  description: { type: String },
  stock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: true },
  showOnWebsite: { type: Boolean, default: true },
  
  // Timestamps
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Flexible field to store all Excel columns (including custom fields and processed image paths)
  data: { type: Object, default: {} },
}, { 
  collection: 'eyewear-products',
  strict: false // Allow additional fields not defined in schema
})

const EyewearProduct = mongoose.models.EyewearProduct || mongoose.model("EyewearProduct", EyewearProductSchema)
export default EyewearProduct
