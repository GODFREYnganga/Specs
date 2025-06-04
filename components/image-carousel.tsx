"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * CarouselItem interface defining the structure of carousel item data
 */
interface CarouselItem {
  id: number
  image: string
  title: string
  description: string
}

/**
 * Sample carousel item data for the image carousel
 * Each item represents a different eyewear category with image, title, and description
 */
const carouselItems: CarouselItem[] = [
  {
    id: 1,
    image: "/images/people/boy-eye-test-equipment.png",
    title: "Vision Clarity for Kids",
    description: "Specialized eyewear designed for growing eyes and active lifestyles.",
  },
  {
    id: 2,
    image: "/images/people/woman-gallery-sunglasses.png",
    title: "Art of Style",
    description: "Elevate your cultural experiences with our fashion-forward frames.",
  },
  {
    id: 3,
    image: "/images/people/man-party-sunglasses.png",
    title: "Night Life Collection",
    description: "Stand out in any social setting with our premium sunglasses.",
  },
  {
    id: 4,
    image: "/images/people/child-blue-sunglasses.png",
    title: "Vibrant Youth",
    description: "Bold colors and durable frames for the next generation.",
  },
  {
    id: 5,
    image: "/images/people/child-glasses-closeup.png",
    title: "Perfect Vision",
    description: "Crystal clear vision with our premium lens technology.",
  },
  {
    id: 6,
    image: "/images/people/girl-hijab-glasses.png",
    title: "Inclusive Designs",
    description: "Frames that complement every style and cultural preference.",
  },
  {
    id: 7,
    image: "/images/people/child-glasses-headband.png",
    title: "Colorful Expressions",
    description: "Let your personality shine with our vibrant collection.",
  },
  {
    id: 10,
    image: "/images/people/elderly-man-turban.png",
    title: "Timeless Elegance",
    description: "Sophisticated eyewear for those who appreciate classic style.",
  },
  {
    id: 11,
    image: "/images/people/neon-glasses-group.png",
    title: "Future Forward",
    description: "Cutting-edge designs for the tech-savvy generation.",
  },
]

/**
 * ImageCarousel Component
 *
 * Displays a full-width image carousel with navigation controls and indicators.
 * Features automatic rotation and smooth transitions between slides.
 */
export function ImageCarousel() {
  // State to track the current slide index
  const [currentIndex, setCurrentIndex] = useState(0)

  // State to track whether a transition is in progress
  const [isTransitioning, setIsTransitioning] = useState(false)

  /**
   * Effect to set up automatic slide rotation
   */
  useEffect(() => {
    // Set up automatic rotation every 5 seconds
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [currentIndex])

  /**
   * Handler for next slide button
   * Includes transition logic to create smooth fade effect
   */
  const nextSlide = () => {
    // Only proceed if not currently in a transition
    if (!isTransitioning) {
      // Start transition (fade out)
      setIsTransitioning(true)

      // After fade out completes, change the slide and fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
        setIsTransitioning(false)
      }, 500) // Duration of fade transition
    }
  }

  /**
   * Handler for previous slide button
   * Includes transition logic to create smooth fade effect
   */
  const prevSlide = () => {
    // Only proceed if not currently in a transition
    if (!isTransitioning) {
      // Start transition (fade out)
      setIsTransitioning(true)

      // After fade out completes, change the slide and fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
        setIsTransitioning(false)
      }, 500) // Duration of fade transition
    }
  }

  /**
   * Handler for indicator buttons to jump to a specific slide
   */
  const goToSlide = (index: number) => {
    // Only proceed if not currently in a transition
    if (!isTransitioning) {
      // Start transition (fade out)
      setIsTransitioning(true)

      // After fade out completes, change the slide and fade in
      setTimeout(() => {
        setCurrentIndex(index)
        setIsTransitioning(false)
      }, 500) // Duration of fade transition
    }
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section header with decorative lines */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
            <h2 className="text-3xl font-bold text-gray-800 px-4">Eyewear For Everyone</h2>
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
          </div>
        </div>

        {/* Main carousel container */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-lg">
          {/* Render all carousel items, but only show the current one */}
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="relative h-full w-full">
                {/* Carousel item image */}
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={index === currentIndex}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gray-800/40" />

                {/* Content overlay with title, description, and button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                  <p className="text-lg mb-8 max-w-md">{item.description}</p>
                  <Link href="/products">
                    <Button className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50">Shop Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-teal-600/60 hover:bg-teal-600/80 transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-teal-600/60 hover:bg-teal-600/80 transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
