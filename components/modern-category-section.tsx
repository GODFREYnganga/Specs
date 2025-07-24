"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: 1,
    title: "Prescription Glasses",
    subtitle: "Starting at $49",
    description: "Clear vision with style",
    image: "/images/products/1749735302953-hj6a2191.jpeg",
    link: "/products?category=eye-glasses",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Blue Light Glasses",
    subtitle: "Starting at $59",
    description: "Digital eye strain protection",
    image: "/images/products/navy-blue-frames.png",
    link: "/products?category=blue-light-glasses",
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: 3,
    title: "Sunglasses",
    subtitle: "Starting at $69",
    description: "UV protection & style",
    image: "/images/products/1749822746709-rvwvvk3w.jpeg",
    link: "/products?category=sunglasses",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 4,
    title: "Kids Glasses",
    subtitle: "Starting at $39",
    description: "Durable & fun designs",
    image: "/images/products/1749821718538-umak7wvj.jpeg",
    link: "/products?category=kids-glasses",
    color: "from-pink-500 to-rose-600",
  },
];

export function ModernCategorySection() {
  return (
    <>
      {/* Header with lines above the section */}
        <div className="w-full pt-16 pb-8 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative flex items-center w-full">
            <div className="flex-grow h-px bg-gray-300"></div>
            <h2 className="text-3xl font-bold text-gray-800 px-6 whitespace-nowrap z-10 bg-white">
               Shop by Category
            </h2>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
        </div>
      </div>
      

      {/* Colored Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-950">
        <div className="container mx-auto px-4">
          {/* Optional Subtitle */}
          <div className="text-center mb-16">
            <p className="pt-4 text-2xl text-extrabold text-white max-w-2xl mx-auto">
              Find the perfect eyewear for your lifestyle and vision needs
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((category) => (
              <Link key={category.id} href={category.link}>
                <div className="group cursor-pointer">
                  <div
                    className={`relative bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white h-[400px] overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                        <p className="text-white/90 text-sm mb-4">{category.description}</p>
                        <div className="text-2xl font-bold">{category.subtitle}</div>
                      </div>

                      {/* Image */}
                      <div className="flex items-end">
                        <div className="w-[300px] h-[200px]">
                          <img
                            src={category.image || "/placeholder.jpg"}
                            alt={category.title}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="absolute top-6 right-6">
                        <ArrowRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center pb-4">
            <p className="text-white text-xl mb-6">
              Can&apos;t decide? Take our style quiz to find your perfect match
            </p>
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg bg-[#FF6600] hover:border-gray-100 text-white"
              >
                View All Frames
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
