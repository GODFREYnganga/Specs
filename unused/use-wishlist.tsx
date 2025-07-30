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
  addToWishlist: (item: WishlistItem, options?: { silent?: boolean }) => Promise<void>
  removeFromWishlist: (id: string, color?: string, options?: { silent?: boolean }) => Promise<void>
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
    console.log("🔄 useWishlist effect triggered - userId:", userId, "loading:", loading)
    loadWishlist()
  }, [userId, isAuthenticated]) // Reload when user changes or auth state changes
  
  // Save to localStorage for guest users
  useEffect(() => {
    if (userId === "guest" && typeof window !== "undefined") {
      console.log("💾 Saving guest wishlist to localStorage:", wishlist.length, "items")
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist))
    }
  }, [wishlist, userId])
  async function loadWishlist() {
    try {
      setLoading(true)
      console.log("🔄 Loading wishlist for userId:", userId)
      
      if (userId === "guest") {
        // Load from localStorage for guest users
        const stored = typeof window !== "undefined" ? localStorage.getItem(`wishlist_${userId}`) : null
        console.log("📱 Guest wishlist from localStorage:", stored ? "found" : "empty")
        if (stored) {
          const guestWishlist = JSON.parse(stored)
          console.log("❤️ Guest wishlist items:", guestWishlist.length)
          setWishlist(guestWishlist)
        } else {
          setWishlist([])
        }
      } else {
        // Load from API for logged-in users
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        const headers: HeadersInit = {}
        
        if (token) {
          headers.Authorization = `Bearer ${token}`
          console.log("🔑 Using token for wishlist API call")
        }
        
        console.log("🌐 Fetching wishlist from API...")
        const response = await fetch(`/api/wishlist?userId=${userId}`, { headers })
        if (response.ok) {
          const data = await response.json()
          console.log("✅ Wishlist data received:", data.items?.length || 0, "items")
          setWishlist(data.items || [])
        } else {
          console.error("❌ Failed to fetch wishlist:", response.status)
        }
      }
    } catch (error) {
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

  async function addToWishlist(item: WishlistItem, options: { silent?: boolean } = {}) {
    try {
      setLoading(true)
      // Check if already in wishlist
      if (isInWishlist(item.id, item.color)) {
        if (!options.silent) {
          toast({
            title: "Already in wishlist",
            description: "Item is already in your wishlist",
            variant: "destructive",
          })
        }
        return
      }
      // Ensure all required fields are present
      const wishlistItem = {
        ...item,
        productId: item.productId || item.id,
        color: item.color || "Default",
        image: item.image || "/placeholder.svg",
        category: item.category || "other",
      }
      if (userId === "guest") {
        // Handle guest users with localStorage
        setWishlist(prev => [...prev, wishlistItem])
        if (!options.silent) {
          toast({
            title: "Added to wishlist",
            description: `${wishlistItem.name} has been added to your wishlist`,
          })
        }
      } else {
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
            productId: wishlistItem.productId,
            name: wishlistItem.name,
            price: wishlistItem.price,
            color: wishlistItem.color,
            image: wishlistItem.image,
            category: wishlistItem.category,
            userId
          })
        })
        if (response.ok) {
          const data = await response.json()
          setWishlist(data.items || [])
          if (!options.silent) {
            toast({
              title: "Added to wishlist",
              description: `${wishlistItem.name} has been added to your wishlist`,
            })
          }
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to add to wishlist")
        }
      }
    } catch (error) {
      console.error("Add to wishlist error:", error)
      if (!options.silent) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to add to wishlist",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  async function removeFromWishlist(id: string, color?: string, options: { silent?: boolean } = {}) {
    try {
      setLoading(true)
        if (userId === "guest") {
        setWishlist(prev => prev.filter(w => String(w.id) !== id || w.color !== color))
        if (!options.silent) {
          toast({
            title: "Removed from wishlist",
            description: "Item has been removed from your wishlist",
          })
        }
      } else {
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
          if (!options.silent) {
            toast({
              title: "Removed from wishlist",
              description: "Item has been removed from your wishlist",
            })
          }
        } else {
          throw new Error("Failed to remove from wishlist")
        }
      }    } catch (error) {
      console.error("Remove from wishlist error:", error)
      if (!options.silent) {
        toast({
          title: "Error",
          description: "Failed to remove from wishlist",
          variant: "destructive",
        })
      }
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
