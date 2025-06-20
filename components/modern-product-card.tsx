"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Eye, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  price: number
  image?: string
  images?: string[]
  colors?: string[]
  category: "prescription" | "sunglasses" | "reading"
  inStock?: boolean
  description?: string
  rating?: number
  reviews?: number
  discount?: number
  isNew?: boolean
  isBestseller?: boolean
}

interface ModernProductCardProps {
  product: Product
  variant?: "default" | "compact" | "featured"
  showQuickActions?: boolean
  className?: string
}

export function ModernProductCard({ 
  product, 
  variant = "default",
  showQuickActions = true,
  className 
}: ModernProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  
  const { addToCart, loading: cartLoading } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist()
  const { toast } = useToast()
  
  const inWishlist = isInWishlist(product._id)
  
  // Handle multiple images
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image ? [product.image] : ["/placeholder.svg"]
  
  const currentImage = productImages[currentImageIndex] || "/placeholder.svg"
  
  // Calculate discounted price
  const originalPrice = product.price
  const discountedPrice = product.discount 
    ? originalPrice * (1 - product.discount / 100)
    : originalPrice
  
  const handleQuickAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock",
        variant: "destructive",
      })
      return
    }
    
    try {
      await addToCart({
        id: product._id,
        productId: product._id,
        name: product.name,
        price: discountedPrice,
        color: selectedColor,
        quantity: 1,
        image: currentImage
      })
      
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }
  
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id)
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        await addToWishlist({
          id: product._id,
          productId: product._id,
          name: product.name,
          price: discountedPrice,
          image: currentImage,
          description: product.description || "",
          category: product.category
        })
        toast({
          title: "Added to wishlist!",
          description: `${product.name} has been added to your wishlist.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    }
  }
  
  if (variant === "compact") {
    return (
      <Link href={`/products/${product._id}`}>
        <Card className={cn("group overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
          <div className="relative aspect-square">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.discount && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                -{product.discount}%
              </Badge>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm truncate">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-semibold text-lg">
                KSh {discountedPrice.toLocaleString()}
              </span>
              {product.discount && (
                <span className="text-sm text-gray-500 line-through">
                  KSh {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    )
  }
  
  return (
    <div 
      className={cn(
        "group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        variant === "featured" && "lg:col-span-2",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <Badge className="bg-blue-500 text-white">New</Badge>
        )}
        {product.isBestseller && (
          <Badge className="bg-orange-500 text-white">Bestseller</Badge>
        )}
        {product.discount && (
          <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>
        )}
        {!product.inStock && (
          <Badge variant="secondary">Out of Stock</Badge>
        )}
      </div>
      
      {/* Quick Actions */}
      {showQuickActions && (
        <div className={cn(
          "absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        )}>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 bg-white/90 hover:bg-white"
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors",
                inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
              )} 
            />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 bg-white/90 hover:bg-white"
            asChild
          >
            <Link href={`/products/${product._id}`}>
              <Eye className="h-4 w-4 text-gray-600" />
            </Link>
          </Button>
        </div>
      )}
      
      {/* Product Image */}
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Image Navigation Dots */}
          {productImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentImageIndex 
                      ? "bg-white" 
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-5">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs mb-2">
            {product.category}
          </Badge>
          <Link href={`/products/${product._id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating!) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} {product.reviews && `(${product.reviews})`}
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            KSh {discountedPrice.toLocaleString()}
          </span>
          {product.discount && (
            <span className="text-lg text-gray-500 line-through">
              KSh {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Colors:</p>
            <div className="flex gap-2">
              {product.colors.slice(0, 4).map((color) => (
                <button
                  key={color}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all",
                    selectedColor === color 
                      ? "border-blue-500 scale-110" 
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  style={{ 
                    backgroundColor: color.toLowerCase() === 'clear' ? 'transparent' : color.toLowerCase()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedColor(color)
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 self-center">
                  +{product.colors.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            onClick={handleQuickAddToCart}
            disabled={!product.inStock || cartLoading}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {cartLoading ? "Adding..." : "Add to Cart"}
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            asChild
          >
            <Link href={`/products/${product._id}`}>
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
