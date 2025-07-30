"use client"

import { useState, useEffect } from "react"
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
  sale_price?: number
  mrp?: number
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
  const [imageError, setImageError] = useState(false)
  
  // Helper function to process image path and handle fallbacks
  const processImagePath = (imagePath: string | undefined): string => {
    if (!imagePath || imagePath === "/placeholder.svg") {
      return "/placeholder.svg"
    }
    
    // Ensure the path starts with / for Next.js static serving
    let processedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
    
    // Try to handle the mismatch between database paths and actual file paths
    // Database: /images/eyewear-products/1749456362254-sunglasses-525973-1280.jpg
    // Actual: /images/eyewear-products/1753646116002-exz3dj-1749456362254-sunglasses-525973-1280.jpg
    
    // If the image path contains a specific pattern, try to find a matching file
    if (processedPath.includes('/images/eyewear-products/') && !processedPath.includes('placeholder')) {
      // Extract the base filename to try multiple variations
      const filename = processedPath.split('/').pop() || ''
      console.log(`Trying to load image: ${processedPath}, filename: ${filename}`)
    }
    
    return processedPath
  }
  
  const [currentImage, setCurrentImage] = useState(() => {
    // Get the main image with proper fallback
    const mainImage = product.image || product.images?.[0] || "/placeholder.svg"
    return processImagePath(mainImage)
  })
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.code || "")

  const { addItem, loading: cartLoading } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist()
  const { toast } = useToast()
  const router = useRouter()
  const inWishlist = isInWishlist(product._id)

  // Correct pricing logic based on database structure
  const displayPrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price
  const originalPrice = product.mrp && product.mrp > displayPrice ? product.mrp : (product.sale_price && product.sale_price > 0 ? product.price : null)
  const hasDiscount = originalPrice && originalPrice > displayPrice
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0
  
  // Effect to find correct image paths for eyewear products
  useEffect(() => {
    const loadCorrectImage = async () => {
      const mainImage = product.image || product.images?.[0]
      if (mainImage && mainImage.includes('/images/eyewear-products/') && !mainImage.includes('placeholder')) {
        try {
          const response = await fetch(`/api/images/find?path=${encodeURIComponent(mainImage)}`)
          const data = await response.json()
          
          if (data.found && data.correctedPath !== mainImage) {
            console.log(`Corrected image path: ${mainImage} -> ${data.correctedPath}`)
            setCurrentImage(data.correctedPath)
            setImageError(false)
          }
        } catch (error) {
          console.error('Error finding correct image:', error)
        }
      }
    }
    
    loadCorrectImage()
  }, [product._id, product.image, product.images])
  
  const handleMouseEnter = (image: string) => {
    const processedImage = processImagePath(image)
    setCurrentImage(processedImage)
  }
  
  const handleMouseLeave = () => {
    const mainImage = product.image || product.images?.[0] || "/placeholder.svg"
    const processedImage = processImagePath(mainImage)
    setCurrentImage(processedImage)
  }
  
  const handleImageError = () => {
    console.log(`Image failed to load: ${currentImage}`)
    setImageError(true)
    setCurrentImage("/placeholder.svg")
  }

  const handleQuickAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock",
        variant: "destructive",
      })
      return    }
    
    try {
      console.log('🛍️ Adding to cart from product card:', {
        productId: product._id,
        name: product.name,
        price: displayPrice,
        originalPrice: hasDiscount ? originalPrice : undefined,
        color: selectedColor,
        quantity: 1,
        image: currentImage,
        category: product.category || "eyewear",
        inStock: product.inStock ?? true,
        discount: discountPercentage
      })
      
      await addItem({
        productId: product._id,
        name: product.name,
        price: displayPrice,
        originalPrice: hasDiscount ? originalPrice : undefined,
        color: selectedColor,
        quantity: 1,
        image: currentImage,
        category: product.category || "eyewear",
        inStock: product.inStock ?? true,
        discount: discountPercentage
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
          description: `${product.name} removed from wishlist.`        })
      } else {
        await addToWishlist({
          productId: product._id,
          name: product.name,
          price: displayPrice,
          color: selectedColor,
          image: currentImage,
          category: product.category,
          inStock: product.inStock ?? true,
          discount: discountPercentage,
          originalPrice: hasDiscount ? originalPrice : undefined
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
      "DARK BLUE-PURPLE-GOLD": "#4B0082"    }
    return map[name.toUpperCase()] || "#CCC"
  }

  return (
    <Card className={cn("group relative min-h-[400px] p-4 w-full max-w-sm border rounded-2xl hover:shadow-lg transition-all duration-300", className)}>
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          SALE
        </div>
      )}
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

      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square mb-3 overflow-hidden rounded-xl">
          <Image 
            src={imageError ? "/placeholder.svg" : currentImage} 
            alt={product.name} 
            fill 
            className="object-cover transition-transform group-hover:scale-105" 
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
            priority={false}
          />
        </div>
      </Link>

      <div className="space-y-2">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 hover:text-blue-600 uppercase leading-tight">{product.name}</h3>
        </Link>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-lg text-gray-900">KSh {displayPrice.toLocaleString()}</span>
            {hasDiscount && originalPrice && (
              <>
                <span className="line-through text-gray-500 text-sm">KSh {originalPrice.toLocaleString()}</span>
                <span className="text-red-500 font-medium text-sm bg-red-50 px-2 py-1 rounded">-{discountPercentage}%</span>
              </>
            )}
          </div>        </div>

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
        )}        <div className="mt-2 animate-pulse bg-orange-100 px-3 py-2 text-sm rounded-md text-center text-gray-800">
          25% Additional OFF With Membership Plan @500sh
        </div>
      </div>

    </Card>
  )
}