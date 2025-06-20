"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Product } from "@/types/product"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

// Remove id from extension, redefine it as string
interface WishlistItem extends Omit<Product, "id"> {
  id: string
  productId?: string
  color?: string
}

interface WishlistContextType {
  wishlist: WishlistItem[]
  loading: boolean
  addToWishlist: (item: WishlistItem) => Promise<void>
  removeFromWishlist: (id: string, color?: string) => Promise<void>
  isInWishlist: (id: string, color?: string) => boolean
  loadWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  
  // Use actual user ID or "guest" for non-authenticated users
  const userId = isAuthenticated && user ? user.id : "guest"
  useEffect(() => {
    loadWishlist()
  }, [userId]) // Reload when user changes
  // Save to localStorage for guest users
  useEffect(() => {
    if (userId === "guest" && typeof window !== "undefined") {
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist))
    }
  }, [wishlist, userId])

  async function loadWishlist() {
    try {
      setLoading(true)
        if (userId === "guest") {
        // Load from localStorage for guest users
        const stored = typeof window !== "undefined" ? localStorage.getItem(`wishlist_${userId}`) : null
        if (stored) {
          setWishlist(JSON.parse(stored))
        }
      } else {
        // Load from API for logged-in users
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const headers: HeadersInit = {}
        
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
        
        const response = await fetch(`/api/wishlist?userId=${userId}`, { headers })
        if (response.ok) {
          const data = await response.json()
          setWishlist(data.items || [])
        }
      }} catch (error) {
      console.error("Failed to load wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function addToWishlist(item: WishlistItem) {
    try {
      setLoading(true)
        // Check if already in wishlist
      if (isInWishlist(item.id, item.color)) {
        toast({
          title: "Already in wishlist",
          description: "Item is already in your wishlist",
          variant: "destructive",
        })
        return
      }
        if (userId === "guest") {
        // Handle guest users with localStorage
        setWishlist(prev => [...prev, item])
        toast({
          title: "Added to wishlist",
          description: `${item.name} has been added to your wishlist`,
        })      } else {
        // API call for logged-in users
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const headers: HeadersInit = { "Content-Type": "application/json" }
        
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
        
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers,
          body: JSON.stringify({
            productId: item.productId || item.id,
            name: item.name,
            price: item.price,
            color: item.color,
            image: item.image,
            userId
          })
        })
          if (response.ok) {
          const data = await response.json()
          setWishlist(data.items || [])
          toast({
            title: "Added to wishlist",
            description: `${item.name} has been added to your wishlist`,
          })
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to add to wishlist")
        }
      }    } catch (error) {
      console.error("Add to wishlist error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to wishlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function removeFromWishlist(id: string, color?: string) {
    try {
      setLoading(true)
        if (userId === "guest") {
        setWishlist(prev => prev.filter(w => String(w.id) !== id || w.color !== color))
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist",
        })      } else {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const headers: HeadersInit = {}
        
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
        
        const response = await fetch(`/api/wishlist?productId=${id}&color=${color}&userId=${userId}`, {
          method: "DELETE",
          headers
        })
          if (response.ok) {
          const data = await response.json()
          setWishlist(data.items || [])
          toast({
            title: "Removed from wishlist",
            description: "Item has been removed from your wishlist",
          })
        } else {
          throw new Error("Failed to remove from wishlist")
        }
      }    } catch (error) {
      console.error("Remove from wishlist error:", error)
      toast({
        title: "Error",
        description: "Failed to remove from wishlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function isInWishlist(id: string, color?: string) {
    return wishlist.some(w => String(w.id) === id && w.color === color)
  }

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      loading,
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist,
      loadWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
