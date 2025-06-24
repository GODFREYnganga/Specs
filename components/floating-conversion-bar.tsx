"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Zap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-modern-cart"
import { useWishlist } from "@/hooks/use-modern-wishlist"

export function FloatingConversionBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { items } = useCart()
  const { items: wishlistItems } = useWishlist()

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after scrolling 300px
      setIsVisible(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Don't render until mounted to prevent hydration issues
  if (!isMounted || !isVisible) return null
  // Safe length checks
  const cartLength = items?.length || 0
  const wishlistLength = wishlistItems?.length || 0

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Quick Actions */}
      <div className="bg-white rounded-full shadow-lg border p-3 flex flex-col gap-2">
        {/* Virtual Try-On */}
        <Link href="/products?category=blue-light-glasses">
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            Try Virtual Fit
          </Button>
        </Link>

        {/* Flash Sale */}
        <div className="text-center">
          <Badge variant="destructive" className="text-xs animate-pulse">
            🔥 Flash Sale: 40% Off
          </Badge>
          <p className="text-xs text-gray-600 mt-1">Ends in 23h 45m</p>
        </div>
      </div>      {/* Cart & Wishlist */}
      <div className="bg-white rounded-full shadow-lg border p-2 flex gap-2">
        {/* Cart */}
        <Link href="/cart">
          <Button size="icon" variant="outline" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {cartLength > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {cartLength}
              </Badge>
            )}
          </Button>
        </Link>

        {/* Wishlist */}
        <Link href="/profile">
          <Button size="icon" variant="outline" className="relative">
            <Heart className="h-4 w-4" />
            {wishlistLength > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {wishlistLength}
              </Badge>
            )}
          </Button>
        </Link>
      </div>

      {/* Quick Shop */}
      <Link href="/products">
        <Button 
          className="bg-black text-white hover:bg-gray-800 shadow-lg"
          size="lg"
        >
          <Zap className="h-4 w-4 mr-2" />
          Shop Now
        </Button>
      </Link>
    </div>
  )
}
