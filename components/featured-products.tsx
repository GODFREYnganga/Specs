"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductAddToCart } from "@/components/product-add-to-cart"

/**
 * Product interface aligned with database schema
 */
interface Product {
  _id: string
  id?: number
  name: string
  price: number
  category: string
  image: string
  colors?: string[]
  inStock?: boolean
  description?: string
}

/**
 * Fallback product data in case API fails
 */
const fallbackProducts: Product[] = [
  {
    _id: "fallback-1",
    id: 1,
    name: "Gold Round Frames",
    price: 12999,
    category: "prescription",
    image: "/images/products/gold-round-frames.png",
    colors: ["Gold", "Silver", "Rose Gold"],
    inStock: true,
    description: "Timeless design with modern comfort features",
  },
  {
    _id: "fallback-2",
    id: 2,
    name: "Blue Light Protection",
    price: 14999,
    category: "blue-light",
    image: "/images/products/blue-round-frames.png",
    colors: ["Blue", "Black", "Clear"],
    inStock: true,
    description: "Digital screen protection with style",
  },
  {
    _id: "fallback-3",
    id: 3,
    name: "Classic Black Frames",
    price: 11999,
    category: "prescription",
    image: "/images/products/black-round-frames.png",
    colors: ["Black", "Tortoise", "Clear"],
    inStock: true,
    description: "Versatile frames for everyday wear",
  },
  {
    _id: "fallback-4",
    id: 4,
    name: "Cat Eye Sunglasses",
    price: 15999,
    category: "sunglasses",
    image: "/images/products/white-cat-eye-frames.png",
    colors: ["White", "Black", "Tortoise"],
    inStock: true,
    description: "Elegant cat eye design with UV protection",
  },
]

/**
 * FeaturedProducts Component
 *
 * Displays a carousel of featured products with navigation controls.
 * Fetches real products from the database and includes automatic rotation and fade-in animations.
 */
export function FeaturedProducts() {
  // State to track the current starting index of visible products
  const [currentIndex, setCurrentIndex] = useState(0)

  // State to store the currently visible products (subset of all products)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])

  // State to store all fetched products
  const [products, setProducts] = useState<Product[]>([])

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reference to the container element for potential DOM manipulations
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Effect to fetch products from the database
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/eyewear-products?featured=true&limit=8')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()

        // Use first 8 products for featured section, or fallback products if none found
        const featuredProducts = data.length > 0 ? data.slice(0, 8) : fallbackProducts

        // Transform the data to match our interface
        const transformedProducts = featuredProducts.map((product: any) => ({
          _id: product._id,
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image || "/placeholder.svg",
          colors: product.colors || ["Default"],
          inStock: product.inStock !== false, // Default to true if not specified
          description: product.description || "Premium eyewear for modern lifestyle",
        }))

        setProducts(transformedProducts)
        setError(null)
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError('Failed to load products')
        // Use fallback products on error
        setProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  /**
   * Effect to update visible products when the current index or products change
   * Also sets up automatic rotation of products
   */
  useEffect(() => {
    if (products.length === 0) return

    // Calculate which products should be visible based on current index
    const startIdx = currentIndex % products.length
    const endIdx = startIdx + 6

    // Handle wrapping around when we reach the end of the products array
    setVisibleProducts(
      endIdx <= products.length
        ? products.slice(startIdx, endIdx)
        : [...products.slice(startIdx), ...products.slice(0, endIdx - products.length)],
    )

    // Set up automatic rotation every 5 seconds only if we have products
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % products.length)
    }, 5000)

    // Clean up interval on component unmount or when dependencies change
    return () => clearInterval(interval)
  }, [currentIndex, products])

  /**
   * Effect to set up intersection observer for fade-in animations
   * This creates a nice effect where products fade in as they enter the viewport
   */
  useEffect(() => {
    // Create an intersection observer to detect when product cards become visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class when element becomes visible
            entry.target.classList.add("animate-fadeIn")
            // Stop observing once animation is triggered
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    // Start observing all product cards
    const cards = document.querySelectorAll(".product-card")
    cards.forEach((card) => observer.observe(card))

    // Clean up observer on component unmount
    return () => observer.disconnect()
  }, [visibleProducts])

  // Handler for next slide button
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % products.length)

  // Handler for previous slide button
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)

  return (
    <>
      <div className="text-center pt-16 pb-8">
        <div className="flex items-center justify-center mb-4">

          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="text-4xl font-bold text-black px-4">Featured Collection</h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
      </div>
      <section className="bg-gray-100 w-full px-0 mx-0">
        <div className="w-full px-2 sm:px-2 lg:px-4">

          {loading ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Loading featured products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-red-600">Failed to load products</p>
                <p className="text-gray-500">Showing fallback products instead</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row">
              {/* Left column with descriptive text */}
              <div className="lg:w-1/8">
                <div className="pt-20 max-w-7xl mx-auto text-center rounded-xl">
                  <blockquote className="max-w-7xl mx-auto space-y-10">
                    <p className="text-2xl md:text-4xl font-semibold text-gray-800 leading-tight">
                      “Crafted with precision,”
                    </p>
                    <p className="text-xl md:text-2xl text-gray-700">
                      Premium materials for lasting comfort
                    </p>
                    <p className="text-xl md:text-2xl italic text-gray-600">
                      and trend-forward designs.
                    </p>
                  </blockquote>
                </div>
              </div>

              {/* Right column with product carousel */}
              <div className="w-3/4">
                <div className="flex items-center gap-4">
                  {/* Previous slide button */}
                  <button
                    onClick={prevSlide}
                    className="p-3 rounded-full border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition shrink-0"
                    aria-label="Previous product"
                    disabled={products.length === 0}
                  >
                    <ArrowLeft size={20} />
                  </button>

                  {/* Product cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-6 gap-2 w-full">
                    {visibleProducts.map((product) => (
                      <div key={product._id} className="opacity-0 animate-fadeIn product-card">
                        <ProductAddToCart
                          product={product}
                          showQuickView={true}
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Next slide button */}
                  <button
                    onClick={nextSlide}
                    className="p-3 rounded-full border border-teal-600 text-teal-600 hover:bg-orange-600 hover:text-white transition shrink-0"
                    aria-label="Next product"
                    disabled={products.length === 0}
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
