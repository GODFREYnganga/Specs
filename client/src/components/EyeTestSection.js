"use client"

import { useState, useEffect } from "react"
import "./EyeTestSection.css"

/**
 * Array of image paths for the eye test section carousel
 */
const eyeTestImages = ["/images/people/eye-test-home.png", "/images/people/boy-eye-test-equipment.png"]

/**
 * EyeTestSection Component
 *
 * Displays information about home eye testing services with a fading image carousel.
 * Features automatic image rotation with smooth transitions.
 */
function EyeTestSection() {
  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // State to track whether a transition is in progress
  const [isTransitioning, setIsTransitioning] = useState(false)

  /**
   * Effect to set up automatic image rotation
   * Creates a smooth fade transition between images
   */
  useEffect(() => {
    // Set up interval for image rotation
    const interval = setInterval(() => {
      // Start transition (fade out)
      setIsTransitioning(true)

      // After fade out completes, change the image and fade in
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % eyeTestImages.length)
        setIsTransitioning(false)
      }, 700) // Duration of fade transition
    }, 5000) // Total time between image changes

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="eye-test-section bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section header with decorative lines */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
            <h2 className="text-3xl font-bold text-gray-800 px-4">Book Eye Test At Home</h2>
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column with image carousel */}
          <div className="test-card relative h-96 rounded-lg overflow-hidden">
            {/* Render both images, but only show the current one */}
            {eyeTestImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentImageIndex ? (isTransitioning ? "opacity-0" : "opacity-100") : "opacity-0"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt="Eye test at home"
                  className="object-cover w-full h-full transition-opacity"
                />
                {/* Dark overlay for visual effect */}
                <div className="absolute inset-0 bg-gray-800/30 transition-opacity duration-700" />
              </div>
            ))}
          </div>

          {/* Right column with descriptive text */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Professional Eye Care in the Comfort of Your Home</h3>
            <p className="text-gray-700">
              Our certified optometrists bring state-of-the-art equipment directly to your doorstep, providing
              comprehensive eye examinations without the hassle of visiting a clinic.
            </p>
            <p className="text-gray-700">
              The service includes vision testing, prescription updates, and personalized eyewear recommendations
              tailored to your lifestyle and preferences.
            </p>
            <p className="text-gray-700">
              Perfect for busy professionals, families with young children, elderly individuals, or anyone who values
              convenience without compromising on quality eye care.
            </p>
            {/* Coming soon button (disabled) */}
            <button className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 cursor-not-allowed px-4 py-2 rounded">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EyeTestSection
