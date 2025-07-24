"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Phone, MessageCircle, ArrowRight } from "lucide-react"

export function ConversionFooterSection() {
  return (
    <>
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4 bg-[#FF6600] text-white">
          Limited Time Offer
        </Badge>
        <div className="flex items-center justify-center mb-4">

          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="text-4xl font-bold text-black px-4">Still deciding? Get expert help!</h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
      </div>

      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xl text-white mb-8">
              Our eyewear specialists are here to help you find the perfect frames
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Free Consultation */}
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Phone className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Free Phone Consultation</h3>
              <p className="text-white/90 mb-4">Speak with an eyewear specialist in under 2 minutes</p>
              <Button variant="secondary" className="w-full">
                Call Now: 1-800-GLASSES
              </Button>
            </div>

            {/* Live Chat */}
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <MessageCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Live Chat Support</h3>
              <p className="text-white/90 mb-4">Get instant answers to your questions</p>
              <Button variant="secondary" className="w-full">
                Start Chat
              </Button>
            </div>

            {/* Store Visit */}
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Book Store Visit</h3>
              <p className="text-white/90 mb-4">Professional fitting and eye test available</p>
              <Button variant="secondary" className="w-full">
                Find Store Near You
              </Button>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Ready to see clearly?</h3>
            <p className="text-white/90 mb-6 text-lg">
              Join 500,000+ customers who've found their perfect frames with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link href="/products" className="flex-1">
                <Button size="lg" className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                  Shop All Frames
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?category=blue-light-glasses" className="flex-1">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-gray-900 font-semibold">
                  Try Virtual Fitting
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-sm text-white/80">
              <p>✅ Free shipping & returns • ✅ 30-day guarantee • ✅ Lifetime warranty</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
