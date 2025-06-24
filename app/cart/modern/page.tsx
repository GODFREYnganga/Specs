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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/products" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              {!isEmpty && (
                <p className="text-gray-600 mt-1">
                  {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} in your cart
                </p>
              )}
            </div>
            
            {!isEmpty && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>
        </div>

        {isEmpty ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
              <ShoppingBag className="h-full w-full" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start browsing our collection to find your perfect glasses.
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                Start Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Items in your cart
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="h-24 w-24 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={96}
                              height={96}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                <Link href={`/products/${item.productId}`} className="hover:underline">
                                  {item.name}
                                </Link>
                              </h3>
                              <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                                <span>Color: {item.color}</span>
                                {item.size && (
                                  <>
                                    <span>•</span>
                                    <span>Size: {item.size}</span>
                                  </>
                                )}
                              </div>
                              
                              {/* Stock Status */}
                              <div className="mt-2">
                                {item.inStock ? (
                                  <div className="flex items-center text-green-600 text-sm">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    In Stock
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-600 text-sm">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Out of Stock
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-base font-medium text-gray-900">
                                {settings.currency} {((item.price * item.quantity) / 100).toFixed(2)}
                              </div>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  {settings.currency} {((item.originalPrice * item.quantity) / 100).toFixed(2)}
                                </div>
                              )}
                              <div className="text-sm text-gray-500">
                                {settings.currency} {(item.price / 100).toFixed(2)} each
                              </div>
                            </div>
                          </div>

                          {/* Quantity and Actions */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={item.maxQuantity && item.quantity >= item.maxQuantity}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Item Actions */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMoveToWishlist(item)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                Move to Wishlist
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {index < items.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="space-y-6">
                {/* Coupon Code */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-base">
                      <Tag className="h-4 w-4 mr-2" />
                      Promo Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-800">
                            {appliedCoupon.code}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-700 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter promo code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || isApplyingCoupon}
                        >
                          {isApplyingCoupon ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({totals.itemCount} items)</span>
                        <span>{settings.currency} {(totals.subtotal / 100).toFixed(2)}</span>
                      </div>
                      
                      {totals.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-{settings.currency} {(totals.discount / 100).toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>
                          {totals.shipping === 0 ? 
                            'Free' : 
                            `${settings.currency} ${(totals.shipping / 100).toFixed(2)}`
                          }
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Tax (VAT)</span>
                        <span>{settings.currency} {(totals.tax / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{settings.currency} {(totals.total / 100).toFixed(2)}</span>
                    </div>

                    {totals.subtotal < settings.freeShippingThreshold && (
                      <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                        Add {settings.currency} {((settings.freeShippingThreshold - totals.subtotal) / 100).toFixed(2)} more for free shipping!
                      </div>
                    )}

                    <Button asChild className="w-full" size="lg">
                      <Link href="/checkout">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceed to Checkout
                      </Link>
                    </Button>

                    {/* Trust Indicators */}
                    <div className="text-xs text-gray-500 space-y-2 pt-4 border-t">
                      <div className="flex items-center">
                        <Truck className="h-3 w-3 mr-2" />
                        <span>Estimated delivery: {estimatedDelivery}</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-3 w-3 mr-2" />
                        <span>Secure checkout with SSL encryption</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="h-3 w-3 mr-2" />
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
