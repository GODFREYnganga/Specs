"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ShoppingBag, 
  Minus, 
  Plus, 
  Trash2, 
  Heart, 
  ArrowLeft, 
  Package, 
  Truck, 
  Shield, 
  CreditCard,
  Tag,
  X,
  Clock,
  CheckCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/hooks/use-modern-cart'
import { useWishlist } from '@/hooks/use-modern-wishlist'

export default function ModernCartPage() {
  const { items, totals, settings, loading, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon, appliedCoupon } = useCart()
  const { addItem: addToWishlist } = useWishlist()
  const { toast } = useToast()
  
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [estimatedDelivery, setEstimatedDelivery] = useState('')
  const [correctedImages, setCorrectedImages] = useState<{[key: string]: string}>({})

  // Image loading function
  const findCorrectImagePath = async (imagePath: string): Promise<string> => {
    try {
      const response = await fetch(`/api/images/find?path=${encodeURIComponent(imagePath)}`)
      const data = await response.json()
      return data.found ? data.correctedPath : "/placeholder.svg"
    } catch (error) {
      console.error('Error finding image path:', error)
      return "/placeholder.svg"
    }
  }

  // Load correct image paths for all items
  useEffect(() => {
    const loadImages = async () => {
      const imageMap: {[key: string]: string} = {}
      
      for (const item of items) {
        if (item.image && !correctedImages[item.id]) {
          const correctedPath = await findCorrectImagePath(item.image)
          imageMap[item.id] = correctedPath
        }
      }
      
      if (Object.keys(imageMap).length > 0) {
        setCorrectedImages(prev => ({ ...prev, ...imageMap }))
      }
    }

    if (items.length > 0) {
      loadImages()
    }
  }, [items, correctedImages])

  useEffect(() => {
    // Calculate estimated delivery (5-7 business days from now)
    const today = new Date()
    const deliveryDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days
    setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    }))
  }, [])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quantity',
        variant: 'destructive'
      })
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId)
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive'
      })
    }
  }

  const handleMoveToWishlist = async (item: any) => {
    try {
      await addToWishlist({
        productId: item.productId,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        color: item.color,
        size: item.size,
        image: item.image,
        category: item.category,
        inStock: item.inStock,
        discount: item.discount,
        variant: item.variant
      })
      await removeItem(item.id)
      toast({
        title: 'Moved to wishlist',
        description: `${item.name} has been moved to your wishlist`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to move item to wishlist',
        variant: 'destructive'
      })
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    setIsApplyingCoupon(true)
    try {
      const success = await applyCoupon(couponCode.trim())
      if (success) {
        setCouponCode('')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply coupon',
        variant: 'destructive'
      })
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  const isEmpty = items.length === 0
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/products" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-3 sm:mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
              {!isEmpty && (
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} in your cart
                </p>
              )}
            </div>
            
            {!isEmpty && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start sm:self-center"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>        </div>        {isEmpty ? (
          <div className="text-center py-12 sm:py-16">
            <div key="empty-cart-icon" className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mb-4 sm:mb-6">
              <ShoppingBag className="h-full w-full" />
            </div>
            <h2 key="empty-cart-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p key="empty-cart-message" className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
              Looks like you haven't added any items to your cart yet. Start browsing our collection to find your perfect glasses.
            </p>
            <Button key="start-shopping" asChild size="lg">
              <Link href="/products">
                Start Shopping
              </Link>
            </Button>
          </div>        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center text-sm sm:text-base lg:text-lg">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Items in your cart
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={correctedImages[item.id] || item.image}
                              alt={item.name}
                              width={96}
                              height={96}
                              className="h-full w-full object-cover"
                              onError={() => {
                                // Fallback to placeholder if image fails to load
                                setCorrectedImages(prev => ({ ...prev, [item.id]: "/placeholder.svg" }))
                              }}
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-2 lg:gap-4">
                            <div className="flex-1 min-w-0">                              <h3 className="text-sm sm:text-base font-medium text-gray-900 leading-tight">
                                {item.productId && typeof item.productId === 'string' ? (
                                  <Link href={`/products/${item.productId}`} className="hover:underline">
                                    {item.name}
                                  </Link>
                                ) : (
                                  <span>{item.name}</span>
                                )}
                              </h3>
                              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-x-2 text-xs sm:text-sm text-gray-500">
                                <span>Color: {item.color}</span>
                                {item.size && (
                                  <>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Size: {item.size}</span>
                                  </>
                                )}
                              </div>
                              
                              {/* Stock Status */}
                              <div className="mt-1 sm:mt-2">
                                {item.inStock ? (
                                  <div className="flex items-center text-green-600 text-xs sm:text-sm">
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    In Stock
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-600 text-xs sm:text-sm">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    Out of Stock
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-left lg:text-right flex-shrink-0">
                              <div className="text-sm sm:text-base font-medium text-gray-900">
                                {settings.currency} {((item.price * item.quantity) / 100).toFixed(2)}
                              </div>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="text-xs sm:text-sm text-gray-500 line-through">
                                  {settings.currency} {((item.originalPrice * item.quantity) / 100).toFixed(2)}
                                </div>
                              )}
                              <div className="text-xs sm:text-sm text-gray-500">
                                {settings.currency} {(item.price / 100).toFixed(2)} each
                              </div>
                            </div>
                          </div>

                          {/* Quantity and Actions */}
                          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-center space-x-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={Boolean(item.maxQuantity && item.quantity >= item.maxQuantity)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Item Actions */}
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMoveToWishlist(item)}
                                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
                              >
                                <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="hidden sm:inline">Move to Wishlist</span>
                                <span className="sm:hidden">Wishlist</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-600 hover:text-red-700 p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {index < items.length - 1 && <Separator className="mt-3 sm:mt-4 lg:mt-6" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>{/* Order Summary */}
            <div className="lg:col-span-4 mt-6 lg:mt-0">
              <div className="space-y-4 sm:space-y-6">
                {/* Coupon Code */}
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-sm sm:text-base">
                      <Tag className="h-4 w-4 mr-2" />
                      Promo Code
                    </CardTitle>
                  </CardHeader>                  <CardContent>
                    {appliedCoupon ? (
                      <div key="applied-coupon" className="flex items-center justify-between p-2 sm:p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center min-w-0">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-green-800 truncate">
                            {appliedCoupon.code}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-700 h-6 w-6 p-0 flex-shrink-0 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div key="coupon-input" className="flex flex-col sm:flex-row gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="text-sm"
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || isApplyingCoupon}
                          className="text-sm px-3 sm:px-4 whitespace-nowrap"
                          size="sm"
                        >
                          {isApplyingCoupon ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-sm sm:text-base">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">                    <div className="space-y-2 sm:space-y-3">
                      <div key="subtotal" className="flex justify-between text-xs sm:text-sm">
                        <span>Subtotal ({totals.itemCount} items)</span>
                        <span className="font-medium">{settings.currency} {(totals.subtotal / 100).toFixed(2)}</span>
                      </div>
                      
                      {totals.discount > 0 && (
                        <div key="discount" className="flex justify-between text-xs sm:text-sm text-green-600">
                          <span>Discount</span>
                          <span className="font-medium">-{settings.currency} {(totals.discount / 100).toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div key="shipping" className="flex justify-between text-xs sm:text-sm">
                        <span>Shipping</span>
                        <span className="font-medium">
                          {totals.shipping === 0 ? 
                            'Free' : 
                            `${settings.currency} ${(totals.shipping / 100).toFixed(2)}`
                          }
                        </span>
                      </div>
                      
                      <div key="tax" className="flex justify-between text-xs sm:text-sm">
                        <span>Tax (VAT)</span>
                        <span className="font-medium">{settings.currency} {(totals.tax / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Separator />
                      <div key="total" className="flex justify-between text-base sm:text-lg font-semibold">
                      <span>Total</span>
                      <span>{settings.currency} {(totals.total / 100).toFixed(2)}</span>
                    </div>

                    {totals.subtotal < settings.freeShippingThreshold && (
                      <div key="free-shipping" className="text-xs sm:text-sm text-blue-600 bg-blue-50 p-2 sm:p-3 rounded-md">
                        Add {settings.currency} {((settings.freeShippingThreshold - totals.subtotal) / 100).toFixed(2)} more for free shipping!
                      </div>
                    )}                    <Button key="checkout-button" asChild className="w-full mt-4 sm:mt-6" size="lg">
                      <Link href="/checkout">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceed to Checkout
                      </Link>
                    </Button>{/* Trust Indicators */}
                    <div className="text-xs text-gray-500 space-y-1 sm:space-y-2 pt-3 sm:pt-4 border-t">
                      <div key="delivery" className="flex items-center">
                        <Truck className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">Estimated delivery: {estimatedDelivery}</span>
                      </div>
                      <div key="security" className="flex items-center">
                        <Shield className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>Secure checkout with SSL encryption</span>
                      </div>
                      <div key="return" className="flex items-center">
                        <Package className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>30-day return policy</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
