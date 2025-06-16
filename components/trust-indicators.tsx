"use client"

import { Shield, Truck, RotateCcw, Star, Users, Award } from "lucide-react"

const trustIndicators = [
  {
    icon: Shield,
    title: "FDA Approved",
    description: "All lenses meet FDA safety standards"
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $75 worldwide"
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Hassle-free returns & exchanges"
  },
  {
    icon: Star,
    title: "4.8/5 Rating",
    description: "Based on 25,000+ reviews"
  },
  {
    icon: Users,
    title: "500K+ Customers",
    description: "Trusted by customers worldwide"
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Lifetime warranty on frames"
  }
]

export function TrustIndicators() {
  return (
    <section className="py-12 bg-gray-50 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {trustIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{indicator.title}</h3>
                <p className="text-xs text-gray-600">{indicator.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
