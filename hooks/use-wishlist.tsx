"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Product } from "@/types/product"

// Remove id from extension, redefine it as string
interface WishlistItem extends Omit<Product, "id"> {
  id: string
  color?: string
}

interface WishlistContextType {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string, color?: string) => void
  isInWishlist: (id: string, color?: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("wishlist")
    if (stored) setWishlist(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  function addToWishlist(item: WishlistItem) {
    if (!wishlist.find(w => w.id === item.id && w.color === item.color)) {
      setWishlist([...wishlist, item])
    }
  }

  function removeFromWishlist(id: string, color?: string) {
    setWishlist(wishlist.filter(w => String(w.id) !== id || w.color !== color))
  }

  function isInWishlist(id: string, color?: string) {
    return wishlist.some(w => String(w.id) === id && w.color === color)
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
