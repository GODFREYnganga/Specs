"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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
export function EyeTestSection() {
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
    <>
    <div className="text-center pt-16 pb-8">
        <div className="flex items-center justify-center mb-4">

          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="text-4xl font-bold text-black px-4">Book Eye Test At Home</h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
      </div>
     
      <section className="bg-blue-950 py-16">
  <div className="container mx-auto px-4 md:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      
      {/* Image Carousel */}
      <div className="relative h-96 w-full rounded-lg overflow-hidden">
        {eyeTestImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentImageIndex
                ? isTransitioning
                  ? "opacity-0"
                  : "opacity-100"
                : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt="Eye test at home"
              fill
              className="object-cover transition-opacity"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Optional overlay, semi-transparent if needed */}
            <div className="absolute inset-0 bg-blue-950/50" />
          </div>
        ))}
      </div>

      {/* Text Content */}
      <div className="space-y-6 text-white">
        <h3 className="text-3xl font-bold">
          Professional Eye Care in the Comfort of Your Home
        </h3>
        <p>
          Our certified optometrists bring state-of-the-art equipment directly to your doorstep,
          providing comprehensive eye examinations without the hassle of visiting a clinic.
        </p>
        <p>
          The service includes vision testing, prescription updates, and personalized eyewear
          recommendations tailored to your lifestyle and preferences.
        </p>
        <p>
          Perfect for busy professionals, families with young children, elderly individuals,
          or anyone who values convenience without compromising on quality eye care.
        </p>
        <button className="mt-4 px-6 py-3 bg-[#FF6600] text-white font-semibold rounded-full hover:bg-orange-500 transition">
          Coming Soon
        </button>
      </div>
    </div>
  </div>
</section>


    </>
  )
}
