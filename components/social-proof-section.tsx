"use client"

import { useState } from "react"
import { Star, Quote, ChevronLeft, ChevronRight, Instagram, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const customerReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/images/customers/sarah.jpg",
    rating: 5,
    location: "New York, NY",
    review: "Best glasses shopping experience ever! The virtual try-on was amazing and the quality exceeded my expectations. My prescription is perfect!",
    framesBought: "Blue Light Round Frames",
    verified: true,
    image: "/images/reviews/sarah-glasses.jpg"
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "/images/customers/mike.jpg", 
    rating: 5,
    location: "Los Angeles, CA",
    review: "Fast shipping, great customer service, and the frames fit perfectly. The blue light protection really helps with my computer work.",
    framesBought: "Designer Square Frames",
    verified: true,
    image: "/images/reviews/mike-glasses.jpg"
  },
  {
    id: 3,
    name: "Emma Williams",
    avatar: "/images/customers/emma.jpg",
    rating: 5,
    location: "London, UK", 
    review: "Love my new sunglasses! The quality is premium and they arrived in beautiful packaging. Will definitely order again.",
    framesBought: "Aviator Sunglasses",
    verified: true,
    image: "/images/reviews/emma-sunglasses.jpg"
  },
  {
    id: 4,
    name: "David Rodriguez",
    avatar: "/images/customers/david.jpg",
    rating: 5,
    location: "Toronto, CA",
    review: "The home try-on program is genius! Tried 5 different styles and found the perfect ones. Customer service was incredibly helpful.",
    framesBought: "Vintage Cat-Eye Frames",
    verified: true,
    image: "/images/reviews/david-glasses.jpg"
  }
]

const socialMediaPosts = [
  {
    platform: "instagram",
    username: "@sarah_style_",
    image: "/images/social/post1.jpg",
    caption: "Obsessed with my new glasses from @spectacles! 😍 #EyewearStyle"
  },
  {
    platform: "instagram", 
    username: "@mike_tech",
    image: "/images/social/post2.jpg",
    caption: "Blue light glasses are a game changer for work! 💻 #BlueLight"
  },
  {
    platform: "instagram",
    username: "@emma_adventures",
    image: "/images/social/post3.jpg", 
    caption: "Perfect sunglasses for my vacation! ☀️ #SunglassesStyle"
  }
]

const stats = [
  { number: "500K+", label: "Happy Customers" },
  { number: "4.8/5", label: "Average Rating" },
  { number: "25K+", label: "5-Star Reviews" },
  { number: "99%", label: "Satisfaction Rate" }
]

export function SocialProofSection() {
  const [currentReview, setCurrentReview] = useState(0)

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % customerReviews.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + customerReviews.length) % customerReviews.length)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className=" ">
            {/* Background video */}
  <video
    className="relative w-full h-full object-cover z-0"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/videos/Royalty-Free Footage-iStock.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-gray-600 mb-8">See why customers love shopping with us</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews Carousel */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h3>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white rounded-2xl shadow-lg p-8 relative">
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-green-600 font-medium">Verified Purchase</span>
                  </div>
                  
                  <p className="text-lg mb-4 leading-relaxed">
                    "{customerReviews[currentReview].review}"
                  </p>
                  
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={customerReviews[currentReview].avatar} />
                      <AvatarFallback>{customerReviews[currentReview].name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{customerReviews[currentReview].name}</div>
                      <div className="text-gray-600 text-sm">{customerReviews[currentReview].location}</div>
                      <div className="text-blue-600 text-sm">Purchased: {customerReviews[currentReview].framesBought}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <img 
                    src={customerReviews[currentReview].image || "/placeholder.jpg"} 
                    alt={`${customerReviews[currentReview].name} wearing glasses`}
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg"
              onClick={prevReview}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" 
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg"
              onClick={nextReview}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Review indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {customerReviews.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentReview ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentReview(index)}
              />
            ))}
          </div>
        </div>
</div>
        {/* Social Media Proof */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">See Us on Social Media</h3>
          <p className="text-gray-600 mb-8">#SpectaclesStyle - Share your look!</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {socialMediaPosts.map((post, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden group cursor-pointer">
                <img 
                  src={post.image || "/placeholder.jpg"} 
                  alt="Customer social media post"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Instagram className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white font-medium text-sm">{post.username}</div>
                  <div className="text-white/90 text-xs">{post.caption}</div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="px-6 py-3">
            <Instagram className="h-4 w-4 mr-2" />
            Follow @SpectaclesOfficial
          </Button>
        </div>
      </div>
    </section>
  )
}
