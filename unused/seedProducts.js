const { MongoClient } = require('mongodb')

const sampleProducts = [
  {
    name: "Classic Black Frame",
    description: "Timeless black frame glasses perfect for everyday wear",
    price: 12999, // Price in cents (KSh 129.99)
    category: "reading",
    colors: ["Black", "Brown", "Navy"],
    images: ["/placeholder.svg"],
    image: "/placeholder.svg",
    inStock: true,
    brand: "SpecVision",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Modern Silver Frame",
    description: "Sleek silver frame with modern design",
    price: 15999, // Price in cents (KSh 159.99)
    category: "sunglasses",
    colors: ["Silver", "Gold", "Rose Gold"],
    images: ["/placeholder.svg"],
    image: "/placeholder.svg",
    inStock: true,
    brand: "SpecVision",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Blue Light Blocking",
    description: "Computer glasses that block harmful blue light",
    price: 9999, // Price in cents (KSh 99.99)
    category: "computer",
    colors: ["Clear", "Yellow Tint"],
    images: ["/placeholder.svg"],
    image: "/placeholder.svg",
    inStock: true,
    brand: "SpecVision",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Vintage Round Frame",
    description: "Classic vintage style round frame glasses",
    price: 18999, // Price in cents (KSh 189.99)
    category: "reading",
    colors: ["Tortoise", "Black", "Clear"],
    images: ["/placeholder.svg"],
    image: "/placeholder.svg",
    inStock: true,
    brand: "RetroSpec",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sports Sunglasses",
    description: "Durable sports sunglasses for active lifestyle",
    price: 22999, // Price in cents (KSh 229.99)
    category: "sunglasses",
    colors: ["Black", "Blue", "Red"],
    images: ["/placeholder.svg"],
    image: "/placeholder.svg",
    inStock: true,
    brand: "SportVision",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Elegant Designer Frame",
    description: "Premium designer frame with luxury finish",
    price: 35999, // Price in cents (KSh 359.99)
    category: "designer",
    colors: ["Gold", "Silver", "Rose Gold"],
    images: ["/placeholder.svg"],
    image: "/placeholder.svg",
    inStock: true,
    brand: "LuxeSpec",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedProducts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spectacles-ecommerce'
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db()
    const collection = db.collection('products')
    
    // Clear existing products
    await collection.deleteMany({})
    console.log('Cleared existing products')
    
    // Insert sample products
    const result = await collection.insertMany(sampleProducts)
    console.log(`Inserted ${result.insertedCount} products`)
    
    // Create indexes
    await collection.createIndex({ name: 1 })
    await collection.createIndex({ category: 1 })
    await collection.createIndex({ price: 1 })
    console.log('Created indexes')
    
  } catch (error) {
    console.error('Error seeding products:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

if (require.main === module) {
  seedProducts()
}

module.exports = { seedProducts, sampleProducts }