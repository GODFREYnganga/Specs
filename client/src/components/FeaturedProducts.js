"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getProducts } from "../services/productService"
import "./FeaturedProducts.css"

function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts()
        setProducts(response.data.slice(0, 8)) // Get first 8 products
        setLoading(false)
      } catch (err) {
        setError("Failed to load products. Please try again.")
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Placeholder products for initial render or if API fails
  const placeholderProducts = [
    {
      id: 1,
      name: "Urban Classic",
      price: 12999,
      image: "/images/products/gold-round-frames.png",
      slug: "urban-classic",
    },
    {
      id: 2,
      name: "Sunset Aviator",
      price: 14999,
      image: "/images/products/blue-round-frames.png",
      slug: "sunset-aviator",
    },
    {
      id: 3,
      name: "Reading Pro",
      price: 10999,
      image: "/images/products/black-round-frames.png",
      slug: "reading-pro",
    },
    {
      id: 4,
      name: "Modern Square",
      price: 13999,
      image: "/images/products/white-cat-eye-frames.png",
      slug: "modern-square",
    },
    {
      id: 5,
      name: "Classic Wayfarer",
      price: 11999,
      image: "/images/products/navy-blue-frames.png",
      slug: "classic-wayfarer",
    },
    {
      id: 6,
      name: "Digital Shield",
      price: 15999,
      image: "/images/products/black-blue-light-frames.png",
      slug: "digital-shield",
    },
    {
      id: 7,
      name: "Retro Round",
      price: 13499,
      image: "/images/products/silver-round-frames.png",
      slug: "retro-round",
    },
    {
      id: 8,
      name: "Crystal Clear",
      price: 12499,
      image: "/images/products/clear-frames.png",
      slug: "crystal-clear",
    },
  ]

  const displayProducts = products.length > 0 ? products : placeholderProducts

  return (
    <section className="featured-products py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section header with decorative lines */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
            <h2 className="text-3xl font-bold text-gray-800 px-4">Featured Products</h2>
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of premium eyewear, designed for style and comfort.
          </p>
        </div>

        {error && <div className="text-center text-red-600 mb-8">{error}</div>}

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div key={product.id} className="product-card group">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <Link
                      to={`/products/${product.id || product.slug}`}
                      className="block w-full text-center py-2 bg-white text-gray-900 rounded"
                    >
                      Quick View
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">KSh {(product.price / 100).toFixed(2)}</span>
                    <div className="flex space-x-1">
                      {["Black", "Brown", "Blue"].map((color) => (
                        <span
                          key={color}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        ></span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
