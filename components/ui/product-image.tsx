"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductImageProps {
  src?: string
  alt: string
  className?: string
  fallback?: string
}

export function ProductImage({ src, alt, className, fallback = "/placeholder.svg" }: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src || fallback)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
    setImageSrc(fallback)
  }

  return (
    <div className={cn("relative overflow-hidden bg-gray-50", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          "object-cover w-full h-full transition-all duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          hasError ? "object-contain p-8" : ""
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">👓</div>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}
    </div>
  )
}
