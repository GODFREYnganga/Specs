"use client"

import Image from 'next/image'

export default function TestImagesPage() {
  const testImagePaths = [
    "/images/eyewear-products/1749456418329-sunglasses-5259573-1280.jpg",
    "/images/eyewear-products/1749465882682-simeon-frank-MZNZ4yBiG9E-unsplash.jpg",
    "/images/eyewear-products/IMG-20250604-WA0012.jpg"
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
      
      {testImagePaths.map((imagePath, index) => (
        <div key={index} className="mb-8 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Test Image {index + 1}</h3>
          <p className="text-sm text-gray-600 mb-4">Path: {imagePath}</p>
          
          {/* Test with Next.js Image component */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Next.js Image Component:</h4>
            <div className="relative w-64 h-40 border">
              <Image
                src={imagePath}
                alt={`Test image ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  console.error(`Failed to load image: ${imagePath}`, e)
                }}
                onLoad={() => {
                  console.log(`Successfully loaded image: ${imagePath}`)
                }}
              />
            </div>
          </div>
          
          {/* Test with regular img tag */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Regular img tag:</h4>
            <img
              src={imagePath}
              alt={`Test image ${index + 1}`}
              className="w-64 h-40 object-cover border"
              onError={(e) => {
                console.error(`Failed to load image with img tag: ${imagePath}`, e)
              }}
              onLoad={() => {
                console.log(`Successfully loaded image with img tag: ${imagePath}`)
              }}
            />
          </div>
          
          {/* Test direct link */}
          <div>
            <h4 className="font-medium mb-2">Direct Link:</h4>
            <a 
              href={imagePath} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Open image directly
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
