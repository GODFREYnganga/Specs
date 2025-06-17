"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Eye, Star, Truck } from "lucide-react"

const heroContent = {
  mainTitle: "Premium Glasses",
  subtitle: "Starting at $49",
  description: "Designer frames with prescription lenses, blue light protection, and free shipping",
  mainImage: "/images/hero/diverse-people-glasses.png",
  features: [
    { icon: Star, text: "4.8★ Rating (25k+ reviews)" },
    { icon: Truck, text: "Free shipping & 30-day returns" },
    { icon: Eye, text: "Virtual try-on available" }
  ]
}

const quickShopCategories = [
  {
    name: "Prescription",
    image: "/images/products/gold-round-frames.png",
    link: "/products?category=eye-glasses",
    price: "from $49"
  },
  {
    name: "Blue Light",
    image: "/images/products/blue-round-frames.png", 
    link: "/products?category=blue-light-glasses",
    price: "from $59"
  },
  {
    name: "Sunglasses",
    image: "/images/products/brown-aviator-sunglasses.png",
    link: "/products?category=sunglasses", 
    price: "from $69"
  }
]

export function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <section className="pt-20 relative min-h-[90vh] bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-12">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Trending Badge */}
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                🔥 Trending Now
              </Badge>
              <span className="text-sm text-gray-600">Summer Collection 2025</span>
            </div>

            {/* Main Headlines */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {heroContent.mainTitle}
                <span className="block text-blue-600">{heroContent.subtitle}</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                {heroContent.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {heroContent.features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-center gap-3 text-gray-700">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <span>{feature.text}</span>
                  </div>
                )
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold">
                  Shop All Frames
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Eye className="mr-2 h-5 w-5" />
                Virtual Try-On
              </Button>
            </div>

            {/* Quick Shop Categories */}
            <div className="pt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Shop:</h3>
              <div className="grid grid-cols-3 gap-4">
                {quickShopCategories.map((category, index) => (
                  <Link key={index} href={category.link}>
                    <div className="group cursor-pointer bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-medium text-sm text-gray-900">{category.name}</h4>
                      <p className="text-blue-600 text-sm font-semibold">{category.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroContent.mainImage}
                alt="People wearing stylish glasses"
                className="w-full h-auto max-w-2xl mx-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating Elements */}
              <div className="absolute top-8 right-8 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-600 text-sm">25k+ reviews</span>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 bg-white rounded-lg p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">500K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>

            {/* Video Modal Trigger */}
            {!isVideoPlaying && (
              <button 
                onClick={() => setIsVideoPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-2xl hover:bg-opacity-30 transition-all group"
              >
                <div className="bg-white rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-blue-600 ml-1" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Free Shipping Worldwide
            </span>
            <span>•</span>
            <span>30-Day Money Back Guarantee</span>
            <span>•</span>
            <span>FDA Approved Lenses</span>
            <span>•</span>
            <span>Lifetime Frame Warranty</span>
          </div>
        </div>
      </div>
    </section>
  )
}
