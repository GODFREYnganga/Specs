"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Product interface defining the structure of product data
 */
interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
}

/**
 * Sample product data for the featured products carousel
 * In a production environment, this would likely come from an API
 */
const products: Product[] = [
  {
    id: 1,
    name: "Gold Round Frames",
    price: 12999,
    category: "Eyeglasses",
    image: "/images/products/gold-round-frames.png",
  },
  {
    id: 2,
    name: "Blue Round Frames",
    price: 14999,
    category: "Eyeglasses",
    image: "/images/products/blue-round-frames.png",
  },
  {
    id: 3,
    name: "Black Round Frames",
    price: 11999,
    category: "Eyeglasses",
    image: "/images/products/black-round-frames.png",
  },
  {
    id: 4,
    name: "White Cat Eye Frames",
    price: 15999,
    category: "Eyeglasses",
    image: "/images/products/white-cat-eye-frames.png",
  },
  {
    id: 5,
    name: "Navy Blue Frames",
    price: 13999,
    category: "Eyeglasses",
    image: "/images/products/navy-blue-frames.png",
  },
]

/**
 * FeaturedProducts Component
 *
 * Displays a carousel of featured products with navigation controls.
 * Includes automatic rotation and fade-in animations for product cards.
 */
export function FeaturedProducts() {
  // State to track the current starting index of visible products
  const [currentIndex, setCurrentIndex] = useState(0)

  // State to store the currently visible products (subset of all products)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])

  // Reference to the container element for potential DOM manipulations
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Effect to update visible products when the current index changes
   * Also sets up automatic rotation of products
   */
  useEffect(() => {
    // Calculate which products should be visible based on current index
    const startIdx = currentIndex % products.length
    const endIdx = startIdx + 4

    // Handle wrapping around when we reach the end of the products array
    setVisibleProducts(
      endIdx <= products.length
        ? products.slice(startIdx, endIdx)
        : [...products.slice(startIdx), ...products.slice(0, endIdx - products.length)],
    )

    // Set up automatic rotation every 5 seconds
    const interval = setInterval(nextSlide, 5000)

    // Clean up interval on component unmount or when dependencies change
    return () => clearInterval(interval)
  }, [currentIndex])

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
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section header with decorative lines */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-teal-600 w-16 md:w-32" />
            <h2 className="text-3xl font-bold text-gray-800 px-4">Featured Collection</h2>
            <div className="h-px bg-teal-600 w-16 md:w-32" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column with descriptive text */}
          <div className="lg:w-1/4">
            <div className="space-y-4">
              <p className="text-gray-800 text-lg font-medium">Crafted with precision</p>
              <p className="text-gray-800 text-lg">Premium materials for lasting comfort</p>
              <p className="text-gray-800 text-lg">Trend-forward designs</p>
            </div>
          </div>

          {/* Right column with product carousel */}
          <div className="lg:w-3/4">
            <div className="flex items-center gap-4">
              {/* Previous slide button */}
              <button
                onClick={prevSlide}
                className="p-3 rounded-full border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition shrink-0"
                aria-label="Previous product"
              >
                <ArrowLeft size={20} />
              </button>

              {/* Product cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="product-card group relative bg-white rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md opacity-0"
                  >
                    {/* Product image with hover effect */}
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {/* Product details and shop button */}
                    <div className="p-4 text-center relative">
                      {/* Shop button that appears on hover */}
                      <div className="absolute bottom-full left-0 right-0 flex justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-4">
                        <Link href={`/products/${product.id}`}>
                          <Button className="bg-blue-950 text-white hover:bg-orange-600 border border-teal-700 shadow-lg">
                            Shop Now
                          </Button>
                        </Link>
                      </div>
                      <h3 className="font-medium text-gray-900 mt-2">{product.name}</h3>
                      <p className="text-gray-700">KSh {product.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next slide button */}
              <button
                onClick={nextSlide}
                className="p-3 rounded-full border border-teal-600 text-teal-600 hover:bg-orange-600 hover:text-white transition shrink-0"
                aria-label="Next product"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* View all products button */}
        <div className="mt-10 text-center">
          <Link href="/products">
            <Button className="px-8 py-3 bg-blue-950 text-white font-medium rounded-md hover:bg-orange-600 transition">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
