"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  {
    id: 1,
    title: "Prescription Glasses",
    subtitle: "Starting at $49",
    description: "Clear vision with style",
    image: "/images/products/gold-round-frames.png",
    link: "/products?category=eye-glasses",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "Blue Light Glasses", 
    subtitle: "Starting at $59",
    description: "Digital eye strain protection",
    image: "/images/products/blue-round-frames.png",
    link: "/products?category=blue-light-glasses",
    color: "from-indigo-500 to-purple-600"
  },
  {
    id: 3,
    title: "Sunglasses",
    subtitle: "Starting at $69", 
    description: "UV protection & style",
    image: "/images/products/brown-aviator-sunglasses.png",
    link: "/products?category=sunglasses",
    color: "from-orange-500 to-red-600"
  },
  {
    id: 4,
    title: "Kids Glasses",
    subtitle: "Starting at $39",
    description: "Durable & fun designs",
    image: "/images/products/kids-colorful-frames.png",
    link: "/products?category=kids-glasses", 
    color: "from-pink-500 to-rose-600"
  }
]

export function ModernCategorySection() {
  return (
    <section className="pt-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect eyewear for your lifestyle and vision needs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Link key={category.id} href={category.link}>
              <div className="group cursor-pointer">
                <div className={`relative bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white h-80 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                  </div>

                  <div className="relative z-10 h-full flex flex-col">
                    
                    {/* Category Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                      <p className="text-white/90 text-sm mb-4">{category.description}</p>
                      <div className="text-2xl font-bold">{category.subtitle}</div>
                    </div>

                    {/* Product Image */}
                    <div className="flex justify-center items-end">
                      <div className="w-32 h-32 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
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
        <div className="text-center">
          <p className="text-gray-600 mb-6">Can't decide? Take our style quiz to find your perfect match</p>
          <Link href="/products">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-gray-400"
            >
              View All Frames
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}
