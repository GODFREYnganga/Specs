"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

// Enhanced cart item interface
export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  quantity: number
  color: string
  size?: string
  image: string
  category: string
  inStock: boolean
  maxQuantity?: number
  discount?: number
  variant?: string
}

// Enhanced cart totals interface  
export interface CartTotals {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  itemCount: number
  weight?: number
}

// Settings interface for cart calculations
export interface CartSettings {
  currency: string
  taxRate: number
  freeShippingThreshold: number
  defaultShippingCost: number
  expressShippingCost: number
}

// Cart context interface
interface CartContextType {
  items: CartItem[]
  totals: CartTotals
  settings: CartSettings
  loading: boolean
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  applyCoupon: (code: string) => Promise<boolean>
  removeCoupon: () => void
  refreshCart: () => Promise<void>
  getShippingOptions: () => Promise<ShippingOption[]>
  appliedCoupon?: CouponData
}

interface CouponData {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minimumAmount?: number
}

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  carrier?: string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [totals, setTotals] = useState<CartTotals>({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    itemCount: 0
  })
  const [settings, setSettings] = useState<CartSettings>({
    currency: 'KSh',
    taxRate: 16, // 16% VAT for Kenya
    freeShippingThreshold: 500000, // KSh 5000 in cents
    defaultShippingCost: 50000, // KSh 500 in cents
    expressShippingCost: 150000 // KSh 1500 in cents
  })
  const [loading, setLoading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData>()
  
  const { user, isAuthenticated } = useAuth()
  const userId = isAuthenticated && user ? user.id : 'guest'
  // Load cart on mount and when user changes
  useEffect(() => {
    console.log('🔄 Loading cart for user:', userId)
    loadCart()
    loadSettings()
  }, [userId])

  // Save guest cart to localStorage
  useEffect(() => {
    if (userId === 'guest' && typeof window !== 'undefined') {
      console.log('💾 Saving guest cart to localStorage:', items)
      localStorage.setItem('modern_cart', JSON.stringify(items))
    }
  }, [items, userId])

  // Recalculate totals when items or settings change
  useEffect(() => {
    console.log('🧮 Recalculating totals for items:', items)
    calculateTotals()
  }, [items, settings, appliedCoupon])

  async function loadSettings() {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          currency: data.general?.currency || 'KSh',
          taxRate: data.taxShipping?.taxRate || 16,
          freeShippingThreshold: (data.taxShipping?.freeShippingThreshold || 50) * 100, // Convert to cents
          defaultShippingCost: (data.taxShipping?.defaultShippingCost || 5) * 100,
          expressShippingCost: (data.taxShipping?.expressShippingCost || 15) * 100
        })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  async function loadCart() {
    setLoading(true)
    try {
      if (userId === 'guest') {
        // Load from localStorage for guest users
        const stored = typeof window !== 'undefined' ? localStorage.getItem('modern_cart') : null
        if (stored) {
          setItems(JSON.parse(stored))
        }
      } else {        // Load from API for authenticated users
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch('/api/cart/modern', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        
        if (response.ok) {
          const data = await response.json()
          setItems(data.items || [])
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
      toast({
        title: 'Error',
        description: 'Failed to load cart',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }
  async function addItem(newItem: Omit<CartItem, 'id'>) {
    setLoading(true)
    console.log('🛒 Adding item to cart:', newItem)
    console.log('🔍 User ID:', userId)
    console.log('🔍 Is authenticated:', isAuthenticated)
    
    try {
      const itemId = `${newItem.productId}-${newItem.color}-${newItem.size || 'default'}`
      
      if (userId === 'guest') {
        console.log('👤 Guest user - using localStorage')
        // Handle guest cart
        setItems(prev => {
          const existingIndex = prev.findIndex(item => 
            item.productId === newItem.productId && 
            item.color === newItem.color && 
            item.size === newItem.size
          )
          
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex].quantity += newItem.quantity
            console.log('📝 Updated existing item, new cart:', updated)
            return updated
          } else {
            const newCart = [...prev, { ...newItem, id: itemId }]
            console.log('➕ Added new item, new cart:', newCart)
            return newCart
          }
        })
        
        toast({
          title: 'Added to cart',
          description: `${newItem.name} has been added to your cart`
        })
      } else {
        console.log('🔐 Authenticated user - using API')
        // Handle authenticated user cart via API
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        console.log('🔑 Token exists:', !!token)
        
        const response = await fetch('/api/cart/modern', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(newItem)
        })

        if (response.ok) {
          const data = await response.json()
          setItems(data.items || [])
          toast({
            title: 'Added to cart',
            description: `${newItem.name} has been added to your cart`
          })
        } else {
          throw new Error('Failed to add item')
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) {
      await removeItem(itemId)
      return
    }

    setLoading(true)
    try {
      if (userId === 'guest') {
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        ))
      } else {        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch('/api/cart/modern', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ itemId, quantity })
        })

        if (response.ok) {
          const data = await response.json()
          setItems(data.items || [])
        } else {
          throw new Error('Failed to update quantity')
        }
      }
    } catch (error) {
      console.error('Update quantity error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update quantity',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function removeItem(itemId: string) {
    setLoading(true)
    try {
      if (userId === 'guest') {
        setItems(prev => prev.filter(item => item.id !== itemId))
      } else {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch(`/api/cart?itemId=${itemId}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        if (response.ok) {
          const data = await response.json()
          setItems(data.items || [])
        } else {
          throw new Error('Failed to remove item')
        }
      }

      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart'
      })
    } catch (error) {
      console.error('Remove item error:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function clearCart() {
    setLoading(true)
    try {
      if (userId === 'guest') {
        setItems([])
        if (typeof window !== 'undefined') {
          localStorage.removeItem('modern_cart')
        }
      } else {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch('/api/cart/clear', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        if (response.ok) {
          setItems([])
        } else {
          throw new Error('Failed to clear cart')
        }
      }
      
      setAppliedCoupon(undefined)
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart'
      })
    } catch (error) {
      console.error('Clear cart error:', error)
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function applyCoupon(code: string): Promise<boolean> {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: totals.subtotal })
      })

      if (response.ok) {
        const couponData = await response.json()
        setAppliedCoupon(couponData)
        toast({
          title: 'Coupon applied',
          description: `You saved ${couponData.type === 'percentage' ? couponData.discount + '%' : settings.currency + ' ' + (couponData.discount / 100).toFixed(2)}`
        })
        return true
      } else {
        toast({
          title: 'Invalid coupon',
          description: 'The coupon code is invalid or expired',
          variant: 'destructive'
        })
        return false
      }
    } catch (error) {
      console.error('Apply coupon error:', error)
      toast({
        title: 'Error',
        description: 'Failed to apply coupon',
        variant: 'destructive'
      })
      return false
    }
  }

  function removeCoupon() {
    setAppliedCoupon(undefined)
    toast({
      title: 'Coupon removed',
      description: 'Coupon has been removed from your order'
    })
  }

  async function refreshCart() {
    await loadCart()
  }

  async function getShippingOptions(): Promise<ShippingOption[]> {
    try {
      const response = await fetch('/api/shipping/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: items.map(item => ({ 
            productId: item.productId, 
            quantity: item.quantity,
            weight: 0.5 // Default weight per item
          }))
        })
      })

      if (response.ok) {
        return await response.json()
      } else {
        // Return default options if API fails
        return [
          {
            id: 'standard',
            name: 'Standard Delivery',
            description: '5-7 business days',
            price: totals.subtotal >= settings.freeShippingThreshold ? 0 : settings.defaultShippingCost,
            estimatedDays: '5-7 days'
          },
          {
            id: 'express',
            name: 'Express Delivery',
            description: '2-3 business days',
            price: settings.expressShippingCost,
            estimatedDays: '2-3 days'
          }
        ]
      }
    } catch (error) {
      console.error('Get shipping options error:', error)
      return []
    }
  }

  function calculateTotals() {
    const subtotal = items.reduce((sum, item) => {
      const itemPrice = item.originalPrice || item.price
      const discountedPrice = item.discount ? itemPrice * (1 - item.discount / 100) : itemPrice
      return sum + (discountedPrice * item.quantity)
    }, 0)

    let discount = 0
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discount = subtotal * (appliedCoupon.discount / 100)
      } else {
        discount = appliedCoupon.discount
      }
    }

    const discountedSubtotal = subtotal - discount
    const shipping = discountedSubtotal >= settings.freeShippingThreshold ? 0 : settings.defaultShippingCost
    const tax = Math.round(discountedSubtotal * (settings.taxRate / 100))
    const total = discountedSubtotal + shipping + tax
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    setTotals({
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount
    })
  }

  const value: CartContextType = {
    items,
    totals,
    settings,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    refreshCart,
    getShippingOptions,
    appliedCoupon
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
