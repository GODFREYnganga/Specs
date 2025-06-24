"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

// Enhanced wishlist item interface
export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  color: string
  size?: string
  image: string
  category: string
  inStock: boolean
  discount?: number
  variant?: string
  addedAt: Date
  priority?: 'low' | 'medium' | 'high'
  notes?: string
}

// Wishlist context interface
interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  moveToCart: (itemId: string) => Promise<void>
  moveAllToCart: () => Promise<void>
  clearWishlist: () => Promise<void>
  updateItemPriority: (itemId: string, priority: 'low' | 'medium' | 'high') => Promise<void>
  updateItemNotes: (itemId: string, notes: string) => Promise<void>
  isInWishlist: (productId: string, color?: string, size?: string) => boolean
  refreshWishlist: () => Promise<void>
  shareWishlist: () => Promise<string>
  getWishlistStats: () => WishlistStats
}

interface WishlistStats {
  totalItems: number
  totalValue: number
  averagePrice: number
  categoriesCount: Record<string, number>
  inStockCount: number
  outOfStockCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  
  const { user, isAuthenticated } = useAuth()
  const userId = isAuthenticated && user ? user.id : 'guest'

  // Load wishlist on mount and when user changes
  useEffect(() => {
    loadWishlist()
  }, [userId])

  // Save guest wishlist to localStorage
  useEffect(() => {
    if (userId === 'guest' && typeof window !== 'undefined') {
      localStorage.setItem('modern_wishlist', JSON.stringify(items))
    }
  }, [items, userId])

  async function loadWishlist() {
    setLoading(true)
    try {
      if (userId === 'guest') {
        // Load from localStorage for guest users
        const stored = typeof window !== 'undefined' ? localStorage.getItem('modern_wishlist') : null
        if (stored) {
          const parsedItems = JSON.parse(stored)
          setItems(parsedItems.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })))
        }
      } else {        // Load from API for authenticated users
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch('/api/wishlist/modern', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        
        if (response.ok) {
          const data = await response.json()
          setItems(data.items?.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })) || [])
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error)
      toast({
        title: 'Error',
        description: 'Failed to load wishlist',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }
  async function addItem(newItem: Omit<WishlistItem, 'id' | 'addedAt'>) {
    setLoading(true)
    console.log('❤️ Adding item to wishlist:', newItem)
    console.log('🔍 User ID:', userId)
    console.log('🔍 Is authenticated:', isAuthenticated)
    
    try {
      const itemId = `${newItem.productId}-${newItem.color}-${newItem.size || 'default'}`
      const fullItem: WishlistItem = {
        ...newItem,
        id: itemId,
        addedAt: new Date()
      }
      
      // Check if item already exists
      const exists = items.some(item => 
        item.productId === newItem.productId && 
        item.color === newItem.color && 
        item.size === newItem.size
      )

      if (exists) {
        console.log('⚠️ Item already exists in wishlist')
        toast({
          title: 'Already in wishlist',
          description: `${newItem.name} is already in your wishlist`,
          variant: 'destructive'
        })
        return
      }

      if (userId === 'guest') {
        console.log('👤 Guest user - using localStorage')
        // Handle guest wishlist
        setItems(prev => {
          const newWishlist = [...prev, fullItem]
          console.log('💝 New wishlist:', newWishlist)
          return newWishlist
        })
        
        toast({
          title: 'Added to wishlist',
          description: `${newItem.name} has been added to your wishlist`
        })
      } else {
        console.log('🔐 Authenticated user - using API')
        // Handle authenticated user wishlist via API
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        console.log('🔑 Token exists:', !!token)
        
        const response = await fetch('/api/wishlist/modern', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(fullItem)
        })

        if (response.ok) {
          const data = await response.json()
          setItems(data.items?.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })) || [])
          toast({
            title: 'Added to wishlist',
            description: `${newItem.name} has been added to your wishlist`
          })
        } else {
          throw new Error('Failed to add item')
        }
      }
    } catch (error) {
      console.error('Add to wishlist error:', error)
      toast({
        title: 'Error',
        description: 'Failed to add item to wishlist',
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
        const response = await fetch(`/api/wishlist?itemId=${itemId}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        if (response.ok) {
          const data = await response.json()
          setItems(data.items?.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })) || [])
        } else {
          throw new Error('Failed to remove item')
        }
      }

      toast({
        title: 'Item removed',
        description: 'Item has been removed from your wishlist'
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

  async function moveToCart(itemId: string) {
    try {
      const item = items.find(item => item.id === itemId)
      if (!item) return

      // Import cart hook dynamically to avoid circular dependencies
      const { useCart } = await import('./use-modern-cart')
        // Add to cart (this would need to be implemented via event system or context sharing)
      // For now, we'll use the API directly
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await fetch('/api/cart/modern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: 1,
          color: item.color,
          size: item.size,
          image: item.image,
          category: item.category,
          inStock: item.inStock
        })
      })

      if (response.ok) {
        await removeItem(itemId)
        toast({
          title: 'Moved to cart',
          description: `${item.name} has been moved to your cart`
        })
      } else {
        throw new Error('Failed to move to cart')
      }
    } catch (error) {
      console.error('Move to cart error:', error)
      toast({
        title: 'Error',
        description: 'Failed to move item to cart',
        variant: 'destructive'
      })
    }
  }

  async function moveAllToCart() {
    setLoading(true)
    try {
      let successCount = 0
      const itemsToMove = [...items]

      for (const item of itemsToMove) {
        try {          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
          const response = await fetch('/api/cart/modern', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: 1,
              color: item.color,
              size: item.size,
              image: item.image,
              category: item.category,
              inStock: item.inStock
            })
          })

          if (response.ok) {
            successCount++
          }
        } catch (error) {
          console.error('Error moving item to cart:', error)
        }
      }

      if (successCount > 0) {
        await clearWishlist()
        toast({
          title: 'Items moved to cart',
          description: `${successCount} items have been moved to your cart`
        })
      }
    } catch (error) {
      console.error('Move all to cart error:', error)
      toast({
        title: 'Error',
        description: 'Failed to move items to cart',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function clearWishlist() {
    setLoading(true)
    try {
      if (userId === 'guest') {
        setItems([])
        if (typeof window !== 'undefined') {
          localStorage.removeItem('modern_wishlist')
        }
      } else {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch('/api/wishlist/clear', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        if (response.ok) {
          setItems([])
        } else {
          throw new Error('Failed to clear wishlist')
        }
      }

      toast({
        title: 'Wishlist cleared',
        description: 'All items have been removed from your wishlist'
      })
    } catch (error) {
      console.error('Clear wishlist error:', error)
      toast({
        title: 'Error',
        description: 'Failed to clear wishlist',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function updateItemPriority(itemId: string, priority: 'low' | 'medium' | 'high') {
    try {
      if (userId === 'guest') {
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, priority } : item
        ))
      } else {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch('/api/wishlist/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ itemId, priority })
        })

        if (response.ok) {
          const data = await response.json()
          setItems(data.items?.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })) || [])
        }
      }
    } catch (error) {
      console.error('Update priority error:', error)
    }
  }

  async function updateItemNotes(itemId: string, notes: string) {
    try {
      if (userId === 'guest') {
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, notes } : item
        ))
      } else {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch('/api/wishlist/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ itemId, notes })
        })

        if (response.ok) {
          const data = await response.json()
          setItems(data.items?.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })) || [])
        }
      }
    } catch (error) {
      console.error('Update notes error:', error)
    }
  }

  function isInWishlist(productId: string, color?: string, size?: string): boolean {
    return items.some(item => 
      item.productId === productId && 
      (!color || item.color === color) && 
      (!size || item.size === size)
    )
  }

  async function refreshWishlist() {
    await loadWishlist()
  }

  async function shareWishlist(): Promise<string> {
    try {
      if (userId === 'guest') {
        // Generate a temporary share link for guest users
        const wishlistData = btoa(JSON.stringify(items))
        return `${window.location.origin}/shared-wishlist?data=${wishlistData}`
      } else {
        // Generate a proper share link for authenticated users
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const response = await fetch('/api/wishlist/share', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        if (response.ok) {
          const data = await response.json()
          return data.shareUrl
        } else {
          throw new Error('Failed to generate share link')
        }
      }
    } catch (error) {
      console.error('Share wishlist error:', error)
      throw error
    }
  }

  function getWishlistStats(): WishlistStats {
    const totalItems = items.length
    const totalValue = items.reduce((sum, item) => sum + item.price, 0)
    const averagePrice = totalItems > 0 ? totalValue / totalItems : 0
    
    const categoriesCount = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const inStockCount = items.filter(item => item.inStock).length
    const outOfStockCount = totalItems - inStockCount

    return {
      totalItems,
      totalValue,
      averagePrice,
      categoriesCount,
      inStockCount,
      outOfStockCount
    }
  }

  const value: WishlistContextType = {
    items,
    loading,
    addItem,
    removeItem,
    moveToCart,
    moveAllToCart,
    clearWishlist,
    updateItemPriority,
    updateItemNotes,
    isInWishlist,
    refreshWishlist,
    shareWishlist,
    getWishlistStats
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
