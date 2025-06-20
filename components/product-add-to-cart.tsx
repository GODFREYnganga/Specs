"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { ProductImage } from "@/components/ui/product-image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Product {
  _id: string
  id?: string | number
  name: string
  price: number
  image?: string
  images?: string[] // <-- add this line
  colors?: string[]
  category: string
  inStock?: boolean
  description?: string
}

interface ProductAddToCartProps {
  product: Product
  showQuickView?: boolean
  className?: string
}

export function ProductAddToCart({ product, showQuickView = false, className = "" }: ProductAddToCartProps) {
  const { addToCart, loading } = useCart()
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default")
  const [quantity, setQuantity] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  // Support multiple images
  const images: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image ? [product.image] : ["/placeholder.svg"]

  const handleAddToCart = async () => {
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
        id: product._id || product.id || Math.random().toString(),
        productId: product._id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        quantity: quantity,
        image: images[0],
      })
      router.push("/cart")
    } catch (error) {
      console.error("Add to cart error:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  return (
    <div 
      className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image(s) */}
      <Link href={`/products/${product._id}`} className="block relative aspect-square overflow-hidden">
        <ProductImage
          src={images[0]}
          alt={product.name}
          className="w-full h-full"
        />
        {/* Show thumbnails if multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {images.slice(0, 4).map((img: string, idx: number) => (
              <img key={idx} src={img} alt="thumb" className="w-6 h-6 rounded border bg-white object-cover" />
            ))}
          </div>
        )}

        {/* Stock Badge */}
        {!product.inStock && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Out of Stock
          </Badge>
        )}

        {/* Category Badge */}
        <Badge variant="secondary" className="absolute top-2 right-2 capitalize">
          {product.category}
        </Badge>
      </Link>

      {/* Hover Actions */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-all duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={handleAddToCart}
            disabled={loading || !product.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          
          {showQuickView && (
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full"
              asChild
            >
              <Link href={`/products/${product._id}`}><Eye className="h-4 w-4" /></Link>
            </Button>
          )}
          
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full"
            asChild
          >
            <Link href={`/products/${product._id}`}><Heart className="h-4 w-4" /></Link>
          </Button>
        </div>
      )}

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product._id}`} className="block">
          <h3 className="font-medium text-lg mb-2 line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description || "High-quality eyewear for modern lifestyles"}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold">
            KSh {(product.price / 100).toFixed(2)}
          </span>
        </div>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-3">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Color: {selectedColor}
            </label>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedColor === color 
                      ? "border-gray-900 scale-110" 
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  style={{ 
                    backgroundColor: color.toLowerCase() === 'default' ? '#f3f4f6' : color.toLowerCase() 
                  }}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
          
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={loading || !product.inStock}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  )
}
