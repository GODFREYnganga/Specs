"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./HeroSection.css"

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Premium Eyewear Collection",
      subtitle: "Discover the perfect frames for your style",
      cta: "Shop Now",
      image: "/images/hero/people-collage.png",
      link: "/products?category=eyeglasses",
    },
    {
      title: "Protect Your Vision",
      subtitle: "Blue light blocking glasses for digital comfort",
      cta: "Explore Screen Glasses",
      image: "/images/hero/blue-glasses.png",
      link: "/products?category=screen-glasses",
    },
    {
      title: "Summer Styles",
      subtitle: "Trendy sunglasses for the season",
      cta: "View Collection",
      image: "/images/hero/beach-yellow-glasses.png",
      link: "/products?category=sunglasses",
    },
  ]

  useEffect(() => {
    // Auto-advance slides every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <section className="hero-section relative h-screen">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full text-white">
            <div className="text-center max-w-3xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
              <Link
                to={slide.link}
                className="inline-block px-8 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
