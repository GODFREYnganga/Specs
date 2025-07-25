"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/hooks/use-modern-cart"
import { useWishlist } from "@/hooks/use-modern-wishlist"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ColorOption {
  name: string
  code: string
  image: string
}

interface Product {
  _id: string
  name: string
  price: number
  image?: string
  images?: string[]
  colors?: ColorOption[]
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
  const [currentImage, setCurrentImage] = useState(product.image || product.images?.[0] || "/placeholder.svg")
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.code || "")

  const { addItem, loading: cartLoading } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist()
  const { toast } = useToast()
  const router = useRouter()

  const inWishlist = isInWishlist(product._id)

  const originalPrice = product.price
  const discountedPrice = product.discount
    ? Math.round(originalPrice * (1 - product.discount / 100))
    : originalPrice

  const handleMouseEnter = (image: string) => setCurrentImage(image)
  const handleMouseLeave = () => setCurrentImage(product.image || product.images?.[0] || "/placeholder.svg")

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
      console.log('🛍️ Adding to cart from product card:', {
        productId: product._id,
        name: product.name,
        price: discountedPrice,
        originalPrice: originalPrice,
        color: selectedColor,
        quantity: 1,
        image: currentImage,
        category: product.category || "eyewear",
        inStock: product.inStock ?? true,
        discount: product.discount || 0
      })
      
      await addItem({
        productId: product._id,
        name: product.name,
        price: discountedPrice,
        originalPrice: originalPrice,
        color: selectedColor,
        quantity: 1,
        image: currentImage,
        category: product.category || "eyewear",
        inStock: product.inStock ?? true,
        discount: product.discount || 0
      })
      
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      })
      router.push("/cart")
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
          description: `${product.name} removed from wishlist.`
        })
      } else {
        await addToWishlist({
          productId: product._id,
          name: product.name,
          price: discountedPrice,
          color: selectedColor,
          image: currentImage,
          category: product.category,
          inStock: product.inStock ?? true,
          discount: product.discount,
          originalPrice: product.discount ? originalPrice : undefined
        })
        toast({
          title: "Added to wishlist",
          description: `${product.name} added to wishlist.`
        })
      }
    } catch (err) {
      toast({ title: "Error", description: "Wishlist update failed", variant: "destructive" })
    }
  }

  const getColorHex = (name: string): string => {
    const map: Record<string, string> = {
      RED: "#FF0000",
      BROWN: "#8B4513",
      BLUE: "#0000FF",
      "BLACK-SILVER": "#555",
      "RED-GOLD": "#B22222",
      "BROWN-GOLD": "#A0522D",
      "AQUA BLUE": "#00FFFF",
      BLACK: "#000000",
      PURPLE: "#800080",
      "LIGHT-PINK": "#FFB6C1",
      "DARK BLUE-PURPLE-GOLD": "#4B0082"
    }
    return map[name.toUpperCase()] || "#CCC"
  }

  return (
    <Card className={cn("group relative h-[100px] p-5 w-full max-w-xl border rounded-2xl hover:shadow-lg transition", className)}>
      <div className="absolute top-3 right-3 z-10">
        <Button
          onClick={handleWishlistToggle}
          size="icon"
          className="rounded-full bg-white shadow w-9 h-9"
          disabled={wishlistLoading}
        >
          <Heart className={cn("w-5 h-5", inWishlist ? "fill-red-500 text-red-500" : "text-gray-600")} />
        </Button>
      </div>

      <Link href={`/products/${product._id}}`} className="block">
        <div className="relative aspect-[4/2] mb-3">
          <Image src={currentImage} alt={product.name} fill className="object-cover rounded-xl" />
        </div>
      </Link>

      <div className="flex items-center justify-between mb-2">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-base text-gray-900 line-clamp-1 hover:text-blue-600 uppercase">{product.name}</h3>
        </Link>

      </div>

      <div className="flex gap-2 items-baseline text-xl text-gray-900">
        <span className="font-bold text-lg pointer-events-none">KSh {discountedPrice.toLocaleString()}</span>
        {product.discount ? (
          <>
            <span className="line-through text-gray-500 pointer-events-none">KSh {originalPrice.toLocaleString()}</span>
            <span className="text-red-500 font-medium pointer-events-none">-{product.discount}%</span>
          </>
        ) : (
          <span className="text-gray-500 pointer-events-none">-0%</span>
        )}
      </div>
      {(product.rating || (product.colors && product.colors.length > 0)) && (
  <div className="flex items-center justify-between mt-2">
    {product.rating && (
      <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full text-xs">
        
        <span>{product.rating.toFixed(1)}</span>
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        {product.reviews && (
          <span className="text-gray-500">({product.reviews})</span>
        )}
      </div>
    )}

    {product.colors && product.colors.length > 0 && (
      <div className="flex gap-1">
        {product.colors.map((color) => (
          <div
            key={color.code}
            onMouseEnter={() => handleMouseEnter(color.image)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setSelectedColor(color.code)
            }}
            title={color.name}
            className={cn(
              "w-4 h-4 rounded-full border cursor-pointer",
              selectedColor === color.code ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"
            )}
            style={{ backgroundColor: getColorHex(color.name) }}
          />
        ))}
      </div>
    )}
  </div>
)}


      <div className="mt-2 animate-pulse bg-orange-100 px-3 py-2 text-sm rounded-md text-center text-gray-800">
        25% Additional OFF With Membership Plan @500sh
      </div>

      {product.colors && product.colors.length > 0 && (
        <div className="mt-3 flex gap-1">
          {product.colors.map((color) => (
            <div
              key={color.code}
              onMouseEnter={() => handleMouseEnter(color.image)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setSelectedColor(color.code)
              }}
              title={color.name}
              className={cn(
                "w-5 h-5 rounded-full border cursor-pointer",
                selectedColor === color.code ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"
              )}
              style={{ backgroundColor: getColorHex(color.name) }}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
