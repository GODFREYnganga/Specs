"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Eye, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


interface Product {
  _id: string
  name: string
  price: number
  category: string
  image: string
  rating?: number
  reviews?: number
  isPopular?: boolean
}

const fallbackProducts: Product[] = [
  {
    _id: "1",
    name: "Classic Round Gold",
    price: 4999,
    category: "prescription",
    image: "/images/products/gold-round-frames.png",
    rating: 4.8,
    reviews: 1250,
    isPopular: true
  },
  {
    _id: "2", 
    name: "Blue Light Pro",
    price: 5999,
    category: "blue-light",
    image: "/images/products/blue-round-frames.png",
    rating: 4.9,
    reviews: 890,
    isPopular: true
  },
  {
    _id: "3",
    name: "Aviator Classics",
    price: 6999,
    category: "sunglasses",
    image: "/images/products/brown-aviator-sunglasses.png",
    rating: 4.7,
    reviews: 567,
    isPopular: false
  },
  {
    _id: "4",
    name: "Square Statement",
    price: 5499,
    category: "prescription", 
    image: "/images/products/square-black-frames.png",
    rating: 4.6,
    reviews: 423,
    isPopular: true
  }
]

export function SimpleBestsellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=4&featured=true')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || fallbackProducts)
        } else {
          setProducts(fallbackProducts)
        }
      } catch (error) {
        console.log('Using fallback products')
        setProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bestsellers...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-sky-200">
      <div className="relative">
        <img 
          src={"/images/hero/Backgroundmordern.jpg"} 
          alt="Background Pattern" 
          className="absolute top-0 h-full w-full object-cover"
        />
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center relative mb-16">
          <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-800">
            ⭐ Customer Favorites
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Bestselling Frames
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who chose these top-rated styles
          </p>
        </div>

        {/* Products Grid */}
        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <div key={product._id} className="group">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 p-8">
                  {product.isPopular && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                      Popular
                    </Badge>
                  )}
                  
                  <img 
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                  
                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ${(product.price / 100).toFixed(0)}
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link href={`/products/${product._id}`}>
                      <Button className="w-full bg-black text-white hover:bg-gray-800">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full">
                      Quick View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="relative text-center">
          <Link href="/products">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-gray-400"
            >
              View All Products
            </Button>
          </Link>
        </div>

      </div>
      </div>
    </section>
  )
}
