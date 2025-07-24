"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Eye, Star, Truck } from "lucide-react"

const heroContent = {
  mainTitle: "Premium Glasses",
  subtitle: " Starting at $49",
}

export function HeroSection() {
 
  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Background video */}
      <div className="w-full bg-black flex justify-center items-center">
      <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-lg shadow-lg">
        <video
          className="absolute left-0 w-full h-full object-cover opacity-100 z-0"
          src="/videos/Landingpage-background-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>

      {/* 
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-12">

          {/* Left Content
          <div className="space-y-8">
          Trending Badge */}
            {/* Main Headlines */}
            <div className="absolute space-x-4 bottom-0 left-0 p-6 text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {heroContent.mainTitle}
                <span className="inline text-blue-600">{heroContent.subtitle}</span>
              </h1>
            </div>

            {/* Features 
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
            <div className="absolute space-x-20 bottom-0 right-5 p-6 flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 text-lg font-semibold">
                  Shop All Frames
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 bottom-0 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Eye className="mr-2 h-5 w-5" />
                Virtual Try-On
              </Button>
            </div>
   
    </section>
  )
}
