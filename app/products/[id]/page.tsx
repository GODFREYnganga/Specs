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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = React.use(params)
  const router = useRouter()
  const { toast } = useToast()

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", name: "" })
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      
      try {
        setLoading(true)
        const res = await fetch(`/api/products/${productId}`)
        if (!res.ok) {
          router.push("/products")
          return
        }
        const data = await res.json()
        setProduct(data)
        setSelectedColor(data.colors && data.colors.length > 0 ? data.colors[0] : "")
        
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
          const relatedRes = await fetch(`/api/products?category=${data.category}&limit=4`)
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
      }
    }
    fetchProduct()
  }, [productId, router])

  const handleAddToCart = async () => {
    if (!product) return
    setIsAddingToCart(true)
    try {
      await addToCart({
        id: product._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        quantity,
        image: mainImage
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
    try {
      const wishlistItem = {
        id: String(product._id),
        productId: product._id,
        name: product.name,
        price: product.price,
        color: selectedColor || (product.colors && product.colors[0]) || "Default",
        image: mainImage,
        category: product.category || "other",
        description: product.description || "",
      }

      if (inWishlist) {
        await removeFromWishlist(String(product._id), selectedColor)
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
        text: product.description,
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

  // Handle multiple images
  const productImages: string[] = []
  if (product.images && Array.isArray(product.images)) {
    productImages.push(...product.images)
  } else if (product.image) {
    productImages.push(product.image)
  }
  if (productImages.length === 0) {
    productImages.push("/placeholder.svg")
  }

  const mainImage = productImages[selectedImageIndex] || "/placeholder.svg"
  const inWishlist = isInWishlist(product._id, selectedColor)

  return (
    <div className="container px-4 md:px-6 py-8">
      <Link href="/products" className="flex items-center gap-2 text-sm mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative cursor-zoom-in group">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </DialogContent>
            </Dialog>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Thumbnail Images */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg border overflow-hidden ${
                    selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
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
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground flex items-center">
                {selectedImageIndex + 1} of {productImages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedImageIndex(Math.min(productImages.length - 1, selectedImageIndex + 1))}
                disabled={selectedImageIndex === productImages.length - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.brand && (
                  <Badge variant="secondary">{product.brand}</Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
                className={inWishlist ? "text-red-600" : ""}
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
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating || 0} ({product.reviews || 0} reviews)
              </span>
            </div>
          </div>

          <div className="text-2xl font-bold">KSh {(product.price / 100).toFixed(2)}</div>

          {product.inStock ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span>In Stock</span>
            </div>
          ) : (
            <div className="text-red-500">Out of Stock</div>
          )}

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Frame Color</h3>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
              {product.colors && product.colors.length > 0 ? (
                product.colors.map((color: string) => (
                  <div key={color} className="flex items-center space-x-2">
                    <RadioGroupItem value={color} id={color} />
                    <Label htmlFor={color}>{color}</Label>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default">Default</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
              >
                <Heart className={`h-4 w-4 mr-2 ${inWishlist ? "fill-current text-red-600" : ""}`} />
                {inWishlist ? "In Wishlist" : "Save for Later"}
              </Button>              <Button variant="outline" asChild>
                <Link href="/contact">
                  <Eye className="h-4 w-4 mr-2" />
                  Try Virtual
                </Link>
              </Button>
            </div>
            
            <SizeGuide />
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-green-600" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RefreshCw className="h-4 w-4 text-purple-600" />
              <span>2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p>{product.description}</p>
            {product.features && product.features.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.frameShape && (
              <div className="flex justify-between">
                <span className="font-medium">Frame Shape:</span>
                <span className="text-muted-foreground">{product.frameShape}</span>
              </div>
            )}
            {product.frameType && (
              <div className="flex justify-between">
                <span className="font-medium">Frame Type:</span>
                <span className="text-muted-foreground">{product.frameType}</span>
              </div>
            )}
            {product.gender && (
              <div className="flex justify-between">
                <span className="font-medium">Gender:</span>
                <span className="text-muted-foreground">{product.gender}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between">
                <span className="font-medium">Weight:</span>
                <span className="text-muted-foreground">{product.weight}</span>
              </div>
            )}
            {product.frameWidth && (
              <div className="flex justify-between">
                <span className="font-medium">Frame Width:</span>
                <span className="text-muted-foreground">{product.frameWidth}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between">
                <span className="font-medium">Material:</span>
                <span className="text-muted-foreground">{product.material}</span>
              </div>
            )}
          </div>
        </TabsContent>
          <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <CardContent className="p-4">
                  <Link href={`/products/${relatedProduct._id}`} className="font-medium hover:underline line-clamp-2">
                    {relatedProduct.name}
                  </Link>
                  <div className="text-lg font-bold mt-2">
                    KSh {(relatedProduct.price / 100).toFixed(2)}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/products/${relatedProduct._id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
