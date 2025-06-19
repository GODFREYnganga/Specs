"use client"

import { Eye, Shield, Truck, Clock, Award, Users } from "lucide-react"

const features = [
  {
    icon: Eye,
    title: "Virtual Try-On",
    description: "See how frames look on you using AR technology",
    color: "text-blue-600"
  },
  {
    icon: Truck,
    title: "Free Home Try-On",
    description: "Try 5 frames at home for 7 days, free shipping both ways",
    color: "text-green-600"
  },
  {
    icon: Shield,
    title: "FDA Approved Lenses",
    description: "All lenses meet highest safety and quality standards",
    color: "text-purple-600"
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Prescription glasses ready in 7-10 business days",
    color: "text-orange-600"
  },
  {
    icon: Award,
    title: "Lifetime Warranty",
    description: "Free repairs and replacements on frame defects",
    color: "text-red-600"
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Licensed opticians available 7 days a week",
    color: "text-indigo-600"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-10 by-blue-200">
      {/* Background video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/Landingpage-background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover opacity-20 z-0"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/Royalty-Free Footage-iStock.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Spectacles?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We make buying glasses online simple, affordable, and risk-free with industry-leading features
          </p>
        </div>

        {/* Features Grid */}


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6 ${feature.color}`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Bottom Stats 
        <div className="by-blue-450 mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">500K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">25K+</div>
            <div className="text-gray-600">5-Star Reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">99%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
*/}
      </div>
    </section>
  )
}
