"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const heroImages = [
  {
    src: "/images/hero/diverse-people-glasses.png",
    alt: "People wearing different styles of glasses",
    title: "Find Your Perfect Style",
    description: "Express yourself with our vibrant collection of designer frames",
  },
  {
    src: "/images/hero/group-glasses.png",
    alt: "Group of people wearing glasses",
    title: "Frames For Everyone",
    description: "Discover our latest arrivals in premium eyewear",
  },
  {
    src: "/images/hero/colorful-glasses-group.png",
    alt: "People wearing colorful glasses",
    title: "See The World Differently",
    description: "Timeless designs meet modern comfort",
  },
  {
    src: "/images/hero/beach-yellow-glasses.png",
    alt: "Man wearing yellow glasses at the beach",
    title: "Summer Ready Styles",
    description: "Premium frames that make a statement",
  },
  {
    src: "/images/hero/woman-gold-glasses.png",
    alt: "Woman wearing gold glasses",
    title: "Elegance In Every Frame",
    description: "Discover frames that complement your unique style and personality",
  },
  {
    src: "/images/people/woman-blue-sunglasses.png",
    alt: "Woman with blue sunglasses",
    title: "Bold Fashion Statement",
    description: "",
  },
  {
    src: "/images/people/man-headphones-glasses.png",
    alt: "Man with headphones and glasses",
    title: "Digital Comfort Collection",
    description: "",
  },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length)
  }

  return (
    <div className="relative h-screen bg-[#898D86]">
      {heroImages.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={slide.src || "/placeholder.svg"}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
              style={{
                transform: index === currentIndex ? "scale(1)" : "scale(1.1)",
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-xl mx-auto text-center">
                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight transform transition-all duration-1000 ${
                    index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  {slide.title}
                </h1>
                <p
                  className={`text-lg md:text-xl text-white mb-8 transform transition-all duration-1000 delay-300 ${
                    index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  {slide.description}
                </p>
                <div
                  className={`flex justify-center transform transition-all duration-1000 delay-500 ${
                    index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  <Link href="/products">
                    <Button size="lg" className="px-8 py-6 bg-white text-gray-900 hover:bg-opacity-90">
                      Shop Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 transition"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
