"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Zap, Shield, Sparkles } from "lucide-react"

const promotionalOffers = [
  {
    icon: Eye,
    badge: "LIMITED TIME",
    title: "Buy 1 Get 1 50% Off",
    description: "Mix and match any frames in our collection",
    cta: "Shop BOGO Deal",
    link: "/products",
    color: "bg-gradient-to-r from-purple-600 to-blue-600"
  },
  {
    icon: Zap,
    badge: "FREE UPGRADE",
    title: "Blue Light Protection",
    description: "FREE with any prescription lens purchase",
    cta: "Add Blue Light",
    link: "/products?category=blue-light-glasses",
    color: "bg-gradient-to-r from-blue-600 to-cyan-600"
  },
  {
    icon: Shield,
    badge: "NEW CUSTOMER",
    title: "Free Home Try-On",
    description: "Try 5 frames at home for 7 days - FREE shipping both ways",
    cta: "Start Try-On",
    link: "/products",
    color: "bg-gradient-to-r from-green-600 to-emerald-600"
  }
]

const urgencyOffers = [
  { text: "🔥 Flash Sale: 40% Off Designer Frames", endTime: "Ends in 23h 45m" },
  { text: "👓 Free Progressive Lenses (Save $200)", endTime: "This week only" },
  { text: "🚚 Free Express Shipping on orders $99+", endTime: "Limited time" }
]

export function PromotionalSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Urgency Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Special Offers - Limited Time Only
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {urgencyOffers.map((offer, index) => (
              <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">{offer.text}</span>
                <span className="text-red-600 ml-2">({offer.endTime})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Promotional Offers */}
        <div className="grid md:grid-cols-3 gap-8">
          {promotionalOffers.map((offer, index) => {
            const IconComponent = offer.icon
            return (
              <div key={index} className={`${offer.color} rounded-2xl p-8 text-white relative overflow-hidden`}>
                <div className="relative z-10">
                  <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
                    {offer.badge}
                  </Badge>
                  <div className="flex items-center mb-4">
                    <IconComponent className="h-8 w-8 mr-3" />
                    <h3 className="text-2xl font-bold">{offer.title}</h3>
                  </div>
                  <p className="text-white/90 mb-6 text-lg">{offer.description}</p>
                  <Link href={offer.link}>
                    <Button 
                      size="lg" 
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold w-full"
                    >
                      {offer.cta}
                    </Button>
                  </Link>
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">Ready to find your perfect frames?</h3>
          <p className="text-gray-600 mb-6">Join over 500,000 satisfied customers worldwide</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="px-8 py-4 bg-black text-white hover:bg-gray-800">
                Browse All Frames
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 py-4">
                Book Eye Test
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
