"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, Check, Heart, ShoppingCart, Star, Plus, Minus, Truck, Shield, RefreshCw, Eye, Share2, ZoomIn, MessageCircle, ThumbsUp, Flag } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-modern-cart"
import { useWishlist } from "@/hooks/use-modern-wishlist"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { SizeGuide } from "@/components/size-guide"
import { logProductData } from "@/lib/product-debug"
import { LensSelectionPopup } from "@/components/lens-selection-popup"


export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = React.use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [showLensPopup, setShowLensPopup] = useState(false)
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [correctedImages, setCorrectedImages] = useState<{[key: string]: string}>({});
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist()
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", name: "" })
  const [showAllReviews, setShowAllReviews] = useState(false)
  
  // Helper function to find the correct image path using the API
  const findCorrectImagePath = async (imagePath: string): Promise<string> => {
    if (!imagePath || imagePath === "/placeholder.svg") {
      return "/placeholder.svg"
    }

    // Check cache first
    if (correctedImages[imagePath]) {
      return correctedImages[imagePath]
    }

    try {
      const response = await fetch(`/api/images/find?path=${encodeURIComponent(imagePath)}`)
      const data = await response.json()
      
      if (data.found && data.correctedPath) {
        // Cache the result
        setCorrectedImages(prev => ({...prev, [imagePath]: data.correctedPath}))
        return data.correctedPath
      } else {
        console.log(`Image not found for path: ${imagePath}`, data)
        return "/placeholder.svg"
      }
    } catch (error) {
      console.error('Error finding image:', error)
      return "/placeholder.svg"
    }
  }
  
  const handleImageError = (imagePath: string) => {
    console.log(`Image failed to load: ${imagePath}`)
    setImageErrors(prev => ({...prev, [imagePath]: true}))
  }
    useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/eyewear-products/${productId}`);
        if (!res.ok) {
          console.error("Error fetching product:", await res.text());
          router.push("/products");
          return;
        }
        const data = await res.json();
        console.log("Product data fetched:", data);
        console.log("Description fields:", {
          product_description: data.product_description,
          description: data.description,
          data_Description: data.data?.Description,
          short_technical_info: data.short_technical_info,
          short_technical_information: data.short_technical_information,
          data_SHORT: data.data?.['SHORT Technical Information'],
          long_technical_info: data.long_technical_info,
          long_technical_information: data.long_technical_information,
          data_LONG: data.data?.['LONG Technical Information'],
        });
          // Ensure the data object is properly populated and log it for debugging
        const processedProduct = {
          ...data,
          colors: data.colors || (data.color ? [data.color] : []),
          inStock: data.inStock ?? true
        };
        
        // Log detailed product data when in development
        if (process.env.NODE_ENV !== 'production') {
          logProductData(processedProduct);
        }
        
        setProduct(processedProduct);
        setSelectedColor(processedProduct.colors.length > 0 ? processedProduct.colors[0] : "");
        
        // Add to recently viewed
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
        const updatedRecent = [data, ...recentlyViewed.filter((item: any) => item._id !== data._id)].slice(0, 10)
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent))
        
        // Load reviews (mock data for now)
        setReviews([
          {
            id: 1,
            name: "John Doe",
            rating: 5,
            comment: "Excellent quality glasses! Very comfortable and stylish.",
            date: "2024-01-15",
            helpful: 12,
            verified: true
          },
          {
            id: 2,
            name: "Jane Smith",
            rating: 4,
            comment: "Good value for money. Fast delivery and great customer service.",
            date: "2024-01-10",
            helpful: 8,
            verified: true
          },
          {
            id: 3,
            name: "Mike Johnson",
            rating: 5,
            comment: "Perfect fit and amazing design. Highly recommended!",
            date: "2024-01-08",
            helpful: 15,
            verified: false
          }
        ])
        
        // Fetch related products
        try {
          const relatedRes = await fetch(`/api/eyewear-products?category=${data.category}&limit=4`)
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json()
            setRelatedProducts(relatedData.products?.filter((p: any) => p._id !== data._id) || [])
          }
        } catch (error) {
          console.error("Error fetching related products:", error)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        router.push("/products")
      } finally {
        setLoading(false)
      }    }
    fetchProduct()
  }, [productId, router])

  // Process images to find correct paths
  useEffect(() => {
    const processImages = async () => {
      if (!product || !product.images) return;
      
      const imagesToProcess = Array.isArray(product.images) ? product.images : [product.image].filter(Boolean);
      
      for (const imagePath of imagesToProcess) {
        if (imagePath && imagePath !== "/placeholder.svg" && !correctedImages[imagePath]) {
          try {
            const correctedPath = await findCorrectImagePath(imagePath);
            if (correctedPath !== imagePath) {
              setCorrectedImages(prev => ({...prev, [imagePath]: correctedPath}));
            }
          } catch (error) {
            console.error('Error processing image:', imagePath, error);
          }
        }
      }
    };
    
    processImages();
  }, [product]);
  
  const handleAddToCart = async () => {
    if (!product) return
    setIsAddingToCart(true)
    try {      await addToCart({
        productId: product._id,
        name: product.name,
        price: product.sale_price > 0 ? product.sale_price : product.price,
        originalPrice: product.mrp > 0 ? product.mrp : undefined,
        color: selectedColor,
        quantity,
        image: mainImage,
        category: product.category || "eyewear",
        inStock: product.inStock !== false
      })
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      })
      router.push("/cart")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }
  
  const handleWishlistToggle = async () => {
    if (!product) return
    
    setIsAddingToWishlist(true)
    try {        const wishlistItem = {
        productId: product._id,
        name: product.name,
        price: product.sale_price > 0 ? product.sale_price : product.price,
        originalPrice: product.mrp > 0 ? product.mrp : undefined,
        color: selectedColor || (product.colors && product.colors[0]) || "Default",
        image: mainImage,
        category: product.category || "other",
        inStock: product.inStock !== false,
        // Additional fields required by the interface
        description: product.product_description || 
                   product.description || 
                   (product.data && product.data.Description) || 
                   ""
      }

      if (inWishlist) {
        await removeFromWishlist(String(product._id))
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        })
      } else {
        await addToWishlist(wishlistItem)
        toast({
          title: "Added to wishlist!",
          description: "Item has been saved to your wishlist.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      })    } finally {
      setIsAddingToWishlist(false)
    }
  }

  const submitReview = () => {
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    const review = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: false
    }

    setReviews([review, ...reviews])
    setNewReview({ rating: 5, comment: "", name: "" })
    toast({
      title: "Review submitted",
      description: "Thank you for your review!",
    })
  }
  const handleShare = async () => {
    if (!product) return
      if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.product_description || 
              product.description || 
              (product.data && product.data.Description) || 
              product.name,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }
  // Handle multiple images, prioritizing the `images` array from bulk upload
  const productImages: string[] = (product.images && Array.isArray(product.images) && product.images.length > 0)
    ? product.images.filter(Boolean).map((img: string) => correctedImages[img] || img)
    : (product.image ? [correctedImages[product.image] || product.image] : []);

  if (productImages.length === 0) {
    productImages.push("/placeholder.svg");
  }
  const mainImage = productImages[selectedImageIndex] || "/placeholder.svg"
  const inWishlist = isInWishlist(String(product._id), selectedColor)
  
  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 -mt-[150px]">
      <Link href="/products" className="flex items-center gap-2 text-xs sm:text-sm mb-4 sm:mb-6 hover:underline">
        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">{/* Product Images */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">            <Dialog>
              <DialogTrigger asChild>
                <div className="relative cursor-zoom-in group">
                  <img
                    src={imageErrors[mainImage] ? "/placeholder.svg" : mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={() => handleImageError(mainImage)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <ZoomIn className="h-6 w-6 sm:h-8 sm:w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-xl sm:max-w-2xl lg:max-w-4xl max-h-[90vh] p-0">
                <img
                  src={imageErrors[mainImage] ? "/placeholder.svg" : mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={() => handleImageError(mainImage)}
                />
              </DialogContent>
            </Dialog>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 sm:top-4 right-2 sm:right-4"
              onClick={handleShare}
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          {/* Thumbnail Images */}
          {productImages.length > 1 && (            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">              {productImages.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg border overflow-hidden ${
                    selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={imageErrors[img] ? "/placeholder.svg" : img}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={() => handleImageError(img)}
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Image Navigation */}
          {productImages.length > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                disabled={selectedImageIndex === 0}
                className="text-xs sm:text-sm"
              >
                Previous
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center px-2">
                {selectedImageIndex + 1} of {productImages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedImageIndex(Math.min(productImages.length - 1, selectedImageIndex + 1))}
                disabled={selectedImageIndex === productImages.length - 1}
                className="text-xs sm:text-sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{product.name}</h1>
                {product.brand && (
                  <Badge variant="secondary" className="text-xs sm:text-sm">{product.brand}</Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className={`${inWishlist ? "text-red-600" : ""} p-2`}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
              </Button>
            </div>            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        i < Math.floor(product.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {product.rating || 0} ({product.reviews || 0} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              KSh {((product.sale_price > 0 ? product.sale_price : product.price))}
            </div>
            {product.mrp > 0 && product.mrp !== (product.sale_price > 0 ? product.sale_price : product.price) && (
              <div className="text-base sm:text-lg text-gray-500 line-through">
                KSh {(product.mrp )}
              </div>
            )}
            {product.mrp > 0 && product.sale_price > 0 && product.mrp > product.sale_price && (
              <div className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 py-1 rounded">
                {Math.round(((product.mrp - product.sale_price) / product.mrp) * 100)}% off
              </div>
            )}
          </div>

          {product.inStock ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-sm sm:text-base">In Stock</span>
            </div>
          ) : (
            <div className="text-red-500 text-sm sm:text-base">Out of Stock</div>
          )}

          <Separator />

          <div>
            <h3 className="font-medium mb-2 text-sm sm:text-base">Frame Color</h3>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
              {product.colors && product.colors.length > 0 ? (
                product.colors.map((color: string) => (
                  <div key={color} className="flex items-center space-x-2">
                    <RadioGroupItem value={color} id={color} />
                    <Label htmlFor={color} className="text-sm sm:text-base">{color}</Label>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default" className="text-sm sm:text-base">Default</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-sm sm:text-base">Quantity</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-16 sm:w-20 text-center text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">

            <Button 
              className="w-full text-sm sm:text-base" 
              size="lg" 
              onClick={() => setShowLensPopup(true)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy With Lens
            </Button>

            <Button
              className="w-full text-sm sm:text-base"
              size="lg"
              variant="outline"
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingToCart ? "Processing..." : "Buy Only Frame"}
            </Button>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className="text-xs sm:text-sm"
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 mr-2 ${inWishlist ? "fill-current text-red-600" : ""}`} />
                {inWishlist ? "In Wishlist" : "Save for Later"}
              </Button>              <Button variant="outline" asChild className="text-xs sm:text-sm">
                <Link href="/contact">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Try Virtual
                </Link>
              </Button>
            </div>
            
            <SizeGuide />
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-t border-b">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
              <span>2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>      {/* Product Information Tabs */}
      <Tabs defaultValue="description" className="mb-8 sm:mb-10 lg:mb-12">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="description" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Description</TabsTrigger>
          <TabsTrigger value="specifications" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Specifications</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Reviews</TabsTrigger>
          <TabsTrigger value="shipping" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Shipping & Returns</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4 sm:mt-6">
          <div className="prose max-w-none space-y-3 sm:space-y-4">            {/* Display Description, Short Technical Information, and Long Technical Information in order */}
            <div>
              <h3 className="font-bold text-base sm:text-lg">Description</h3>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                {product.product_description || 
                 product.description || 
                 (product.data && (product.data.Description || product.data.description || product.data.product_description)) || 
                 "No description available"}
              </p>
            </div>
            
            {(product.short_technical_info || 
              product.short_technical_information || 
              (product.data && product.data['SHORT Technical Information'])) && (
              <div>
                <h3 className="font-bold text-base sm:text-lg mt-3 sm:mt-4">Technical Information</h3>
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                  {product.short_technical_info || 
                   product.short_technical_information || 
                   (product.data && product.data['SHORT Technical Information'])}
                </p>
              </div>
            )}
            
            {(product.long_technical_info || 
              product.long_technical_information || 
              (product.data && product.data['LONG Technical Information'])) && (
              <div>
                <h3 className="font-bold text-base sm:text-lg mt-3 sm:mt-4">Detailed Information</h3>
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                  {product.long_technical_info || 
                   product.long_technical_information || 
                   (product.data && product.data['LONG Technical Information'])}
                </p>
              </div>
            )}
          </div>
        </TabsContent>        <TabsContent value="specifications" className="mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Display direct product properties first */}
                {Object.entries({
                  "Frame Shape": product.shape || product.frameShape || (product.data && (product.data.shape || product.data.frameShape)),
                  "Frame Type": product.frame_type || product.frameType || (product.data && (product.data.frame_type || product.data.frameType)),
                  "Material": product.material || (product.data && product.data.material),
                  "Gender": product.gender || (product.data && product.data.gender),
                  "Size": product.size || (product.data && product.data.size),
                  "Weight": product.weight || (product.data && product.data.weight),
                  "Brand": product.brand || product.brand_name || product.brandName || (product.data && (product.data.brand || product.data.brand_name)),
                  "Color": product.color || (product.data && product.data.color),
                  "Category": product.category || (product.data && product.data.category)
                })
                  .filter(([_, value]) => value)
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">{key}</span>
                      <span className="font-semibold text-sm sm:text-base">{String(value)}</span>
                    </div>
                  ))}
                
                {/* Then display any additional fields from product.data */}
                {product.data && Object.entries(product.data)
                  .filter(([key]) => ![
                    'Description', 'description', 'product_description',
                    'SHORT Technical Information', 'short_technical_information', 'short_technical_info',
                    'LONG Technical Information', 'long_technical_information', 'long_technical_info',
                    'IMAGE 1', 'IMAGE 2', 'IMAGE 3', 'IMAGE 4', 'IMAGE 5', 'IMAGE 6', 'image',
                    // Skip fields we've already shown above
                    'shape', 'frameShape', 'frame_shape', 'frame_type', 'frameType', 'material',
                    'gender', 'size', 'weight', 'brand', 'brand_name', 'brandName',
                    'color', 'category'
                  ].includes(key))
                  .map(([key, value]) => {
                    // Skip empty values or null/undefined
                    if (!value && value !== 0) return null;
                    return (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">{key}</span>
                        <span className="font-semibold text-sm sm:text-base">{String(value)}</span>
                      </div>
                    );
                  })
                  .filter(Boolean)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Reviews Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">
                  {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                </div>
                <div>
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0)
                            ? "text-yellow-500 fill-yellow-500" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {reviews.length} reviews
                  </p>
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-3">{rating}</span>
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-muted-foreground">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Write a Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setNewReview({...newReview, rating})}
                        className="p-1"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            rating <= newReview.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reviewer-name">Your Name</Label>
                  <Input
                    id="reviewer-name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="review-comment">Your Review</Label>
                  <Textarea
                    id="review-comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Share your experience with this product..."
                    rows={4}
                  />
                </div>
                
                <Button onClick={submitReview} className="w-full">
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              {reviews.length > 3 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? "Show Less" : `Show All ${reviews.length} Reviews`}
                </Button>
              )}
            </div>
            
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.name}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {Array(5).fill(0).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm mb-3">{review.comment}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="shipping" className="mt-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Shipping Information</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Free standard shipping on orders over KSh 5,000</li>
                <li>• Standard delivery: 3-5 business days</li>
                <li>• Express delivery: 1-2 business days (additional charges apply)</li>
                <li>• Same-day delivery available in Nairobi CBD</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Returns & Exchange</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 30-day return policy</li>
                <li>• Free returns for damaged or defective items</li>
                <li>• Items must be in original condition with tags attached</li>
                <li>• Exchange available for different sizes or colors</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <Card key={relatedProduct._id} className="group overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 lg:p-4">
                  <Link href={`/products/${relatedProduct._id}`} className="font-medium hover:underline line-clamp-2 text-xs sm:text-sm lg:text-base">
                    {relatedProduct.name}
                  </Link>                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2">
                    <div className="text-sm sm:text-base lg:text-lg font-bold">
                      KSh {((relatedProduct.sale_price > 0 ? relatedProduct.sale_price : relatedProduct.price)).toFixed(2)}
                    </div>
                    {relatedProduct.mrp > 0 && relatedProduct.mrp !== (relatedProduct.sale_price > 0 ? relatedProduct.sale_price : relatedProduct.price) && (
                      <div className="text-xs sm:text-sm text-gray-500 line-through">
                        KSh {(relatedProduct.mrp).toFixed(2)}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-2 sm:p-3 lg:p-4 pt-0">
                  <Button variant="outline" className="w-full text-xs sm:text-sm" size="sm" asChild>
                    <Link href={`/products/${relatedProduct._id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}      {product && (
        <LensSelectionPopup 
          isOpen={showLensPopup} 
          onClose={() => setShowLensPopup(false)}
          framePrice={product.price}
        />
      )}
    </div>
  )
}
