"use client"

import Image from "next/image"
import { useState } from "react"

const images = [
  { src: "/images/banner/navbar/eyeglasses.webp", label: "Eyeglases" },
  { src: "/images/banner/navbar/sunglasses.jpg", label: "Sunglasses" },
  { src: "/images/banner/navbar/screenglasses.jpg", label: "Screen Glasses" },
  { src: "/images/banner/navbar/contactlenses.jpg", label: "Contact Lens" },
  { src: "/images/banner/navbar/powersunglasses.jpg", label: "Power Sunglasses" },
  { src: "/images/banner/navbar/progressivesunglasses.jpg", label: "Progressive Sunglasses" }
]

export default function ImageTileSection() {
  return (
    <section className="bg-gray-100 px-[6px] -mt-[195px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-[20px] py-4 transition-transform duration-300 ease-in-out group-hover:scale-105">
        {images.map((item, index) => (
          <div key={index} className="group relative bg-white h-[200px] rounded-md shadow-sm transition-transform duration-300 ease-in-out group-hover:scale-105">
            {/* Image */}
            <div className="w-full h-full overflow-hidden">
              <Image
                src={item.src}
                alt={item.label}
                width={300}
                height={120}
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              <span className="text-xl text-gray-800 -pt-[10px] font-medium flex justify-center">
                {item.label}
              </span>
            </div>

            {/* Dropdown on hover */}
            <div className="absolute top-[100%] left-0 right-0 translate-y-0 group-hover:translate-y-1 transition-all duration-300 bg-transparent group-hover:bg-white px-3 py-1 rounded-b-md border-t border-gray-300 group-hover:shadow z-10">
              <span className="text-sm text-gray-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                View All
              </span>
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}