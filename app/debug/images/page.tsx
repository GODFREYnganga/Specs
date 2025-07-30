"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"

// Debug page to test image loading
export default function ImageDebugPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/eyewear-products?limit=5')
        const data = await response.json()
        console.log("🔍 API Response:", data)
        setProducts(data)
      } catch (error) {
        console.error("❌ Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const testImages = [
    "/images/eyewear-products/1753646114879-5bbid8-2h-media-HifdOfMgSls-unsplash.jpg",
    "/images/eyewear-products/1753646115040-8t0w45-1749454266858-aviator-sunglasses.jpg",
    "/images/eyewear-products/1753646199573-pjelck-woman-gold-glasses.png"
  ]

  if (loading) {
    return <div className="p-8">Loading products...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Image Debug Page</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Test Static Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testImages.map((imagePath, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Test Image {index + 1}</h3>
              <p className="text-sm text-gray-600 mb-2">{imagePath}</p>
              <div className="relative aspect-[4/3] bg-gray-100 rounded">
                <Image
                  src={imagePath}
                  alt={`Test image ${index + 1}`}
                  fill
                  className="object-cover rounded"
                  onError={(e) => {
                    console.error(`❌ Error loading image: ${imagePath}`)
                    e.currentTarget.style.display = 'none'
                  }}
                  onLoad={() => {
                    console.log(`✅ Successfully loaded: ${imagePath}`)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Products from API</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product: any) => (
            <div key={product._id} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{product.name || product.product_title || "Unnamed Product"}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Main image:</strong> {product.image || "None"}
                </div>
                <div>
                  <strong>Images array:</strong> {product.images ? JSON.stringify(product.images) : "None"}
                </div>
                <div>
                  <strong>IMAGE 1:</strong> {product["IMAGE 1"] || "None"}
                </div>
                <div>
                  <strong>Data object:</strong> {product.data ? JSON.stringify(Object.keys(product.data)) : "None"}
                </div>
              </div>
              
              {product.image && (
                <div className="mt-4">
                  <div className="relative aspect-[4/3] bg-gray-100 rounded">
                    <Image
                      src={product.image}
                      alt={product.name || "Product"}
                      fill
                      className="object-cover rounded"
                      onError={(e) => {
                        console.error(`❌ Error loading product image: ${product.image}`)
                        e.currentTarget.style.display = 'none'
                      }}
                      onLoad={() => {
                        console.log(`✅ Successfully loaded product image: ${product.image}`)
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Raw API Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
          {JSON.stringify(products.slice(0, 2), null, 2)}
        </pre>
      </div>
    </div>
  )
}
