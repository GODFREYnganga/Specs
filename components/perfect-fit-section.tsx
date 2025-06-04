"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * FitSection interface defining the structure of fit section data
 * Each section has multiple images that will rotate in a carousel
 */
interface FitSection {
  id: number
  images: string[]
  title: string
  link: string
}

/**
 * Sample fit section data for the perfect fit section
 * Each item represents a different eyewear category with rotating images
 */
const fitSections: FitSection[] = [
  {
    id: 1,
    images: ["/images/people/lab-researchers.png", "/images/people/scientist-whiteboard.png"],
    title: "Blu Computer Glasses",
    link: "/products?category=computer-glasses",
  },
  {
    id: 2,
    images: ["/images/people/child-glasses-closeup.png", "/images/people/girl-hijab-glasses.png"],
    title: "Magneto EyeGlasses",
    link: "/products?category=magneto",
  },
  {
    id: 3,
    images: ["/images/people/woman-gallery-sunglasses.png", "/images/people/man-party-sunglasses.png"],
    title: "Premium Sunglasses",
    link: "/products?category=sunglasses",
  },
]

/**
 * PerfectFitSection Component
 *
 * Displays a grid of eyewear categories with fading image carousels.
 * Each section automatically rotates through multiple images.
 */
export function PerfectFitSection() {
  // State to track the current image index for each section
  const [currentIndices, setCurrentIndices] = useState<number[]>([0, 0, 0])

  // State to track whether each section is currently transitioning between images
  const [isTransitioning, setIsTransitioning] = useState<boolean[]>([false, false, false])

  /**
   * Effect to set up image rotation for each section
   * Creates a smooth fade transition between images
   */
  useEffect(() => {
    // Create an interval for each section to handle independent image rotation
    const intervals = fitSections.map((_, sectionIndex) => {
      return setInterval(() => {
        // Start the transition (fade out)
        setIsTransitioning((prev) => {
          const newState = [...prev]
          newState[sectionIndex] = true
          return newState
        })

        // After fade out completes, change the image and fade in
        setTimeout(() => {
          // Update to the next image index
          setCurrentIndices((prev) => {
            const newIndices = [...prev]
            newIndices[sectionIndex] = (newIndices[sectionIndex] + 1) % fitSections[sectionIndex].images.length
            return newIndices
          })

          // End the transition (fade in)
          setIsTransitioning((prev) => {
            const newState = [...prev]
            newState[sectionIndex] = false
            return newState
          })
        }, 500) // Duration of fade out transition
      }, 6000) // Total time between image changes
    })

    // Clean up all intervals on component unmount
    return () => intervals.forEach(clearInterval)
  }, [])

  return (
    <section className="py-12 bg-white text-gray-800">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section header with decorative lines */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-white w-16 md:w-32"></div>
            <h2 className="text-3xl font-bold text-white px-4">Find The Perfect Fit</h2>
            <div className="h-px bg-white w-16 md:w-32"></div>
          </div>
        </div>

        {/* Row 1 - First two sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Row 1, Column 1 - Blu Computer Glasses with image carousel */}
          <div className="relative rounded-lg overflow-hidden shadow-md h-[400px]">
            {fitSections[0].images.map((image, imgIndex) => (
              <div
                key={imgIndex}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  imgIndex === currentIndices[0] ? (isTransitioning[0] ? "opacity-0" : "opacity-100") : "opacity-0"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${fitSections[0].title} image ${imgIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Overlay with title and button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{fitSections[0].title}</h3>
              <Link href={fitSections[0].link}>
                <Button className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50">Shop Now</Button>
              </Link>
            </div>
          </div>

          {/* Row 1, Column 2 - Vision Testing (static image) */}
          <div className="relative rounded-lg overflow-hidden shadow-md h-[400px]">
            <img
              src="/images/people/boy-eye-test-equipment.png"
              alt="Eye test equipment"
              className="w-full h-full object-cover"
            />
            {/* Overlay with title and button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
              <h3 className="text-2xl font-bold text-white mb-4">Vision Testing</h3>
              <Link href="/products?category=vision-testing">
                <Button className="bg-teal-700 text-white hover:bg-teal-800">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2 - Second two sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Row 2, Column 1 - Magneto EyeGlasses with image carousel */}
          <div className="relative rounded-lg overflow-hidden shadow-md h-[400px]">
            {fitSections[1].images.map((image, imgIndex) => (
              <div
                key={imgIndex}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  imgIndex === currentIndices[1] ? (isTransitioning[1] ? "opacity-0" : "opacity-100") : "opacity-0"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${fitSections[1].title} image ${imgIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Overlay with title and button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
              <h3 className="text-2xl font-bold text-white mb-4">{fitSections[1].title}</h3>
              <Link href={fitSections[1].link}>
                <Button className="bg-teal-700 text-white hover:bg-teal-800">Shop Now</Button>
              </Link>
            </div>
          </div>

          {/* Row 2, Column 2 - Premium Sunglasses with image carousel */}
          <div className="relative rounded-lg overflow-hidden shadow-md h-[400px]">
            {fitSections[2].images.map((image, imgIndex) => (
              <div
                key={imgIndex}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  imgIndex === currentIndices[2] ? (isTransitioning[2] ? "opacity-0" : "opacity-100") : "opacity-0"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${fitSections[2].title} image ${imgIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Overlay with title and button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
              <h3 className="text-2xl font-bold text-white mb-4">{fitSections[2].title}</h3>
              <Link href={fitSections[2].link}>
                <Button className="bg-teal-700 text-white hover:bg-teal-800">Shop Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
