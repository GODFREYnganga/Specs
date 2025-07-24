"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/images/banner/sunglasses1.jpg",
  "/images/banner/sunglasses2.jpg",
  "/images/banner/sunglasses3.jpg",
];

export default function TrendingSunglasses() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds



    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header with Lines */}
       <div className="text-center pt-16 pb-8">
        <div className="flex items-center justify-center mb-4">

          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="text-4xl font-bold text-black px-4">Trending Sunglasses</h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
      </div>

      {/* Grid Section */}
      <section className="w-full bg-white">
        <div className="grid md:grid-cols-2 gap-0 h-[500px]">
          {/* Left Quote */}
          <div className="flex flex-col justify-between items-center py-40 bg-gray-50 px-4 text-center">
    <blockquote className="max-w-3xl">
      <p className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-3">
        “Step into the sun with bold,
      </p>
      <p className="text-2xl md:text-4xl font-semibold text-gray-700 leading-snug">
        stylish frames that define this season’s
      </p>
      <p className="text-2xl md:text-4xl font-semibold text-gray-700 leading-snug italic">
        hottest looks.”
      </p>
    </blockquote>

    <button className="mt-6 px-8 py-3 text-white font-bold rounded-full bg-[#FF6600] hover:bg-orange-600 transition">
      Shop Now
    </button>
  </div>

          {/* Right Slideshow */}
          <div className="relative w-full h-[500px] pt-[100px] overflow-hidden">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Sunglasses ${index + 1}`}
                fill
                priority={index === 0}
                className={`object-cover transition-opacity duration-1000 ${currentIndex === index ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
