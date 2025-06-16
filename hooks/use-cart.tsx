import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export type CartItem = {
  id: string | number
  productId?: string
  name: string
  price: number
  color?: string
  quantity: number
  image?: string
}

export type CartData = {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartData, setCartData] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(false)
  
  // For demo purposes, using "guest" - in real app, get from auth
  const userId = "guest"

  // Load cart from API or localStorage on mount
  useEffect(() => {
    loadCart()
  }, [])

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (userId === "guest" && typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  async function loadCart() {
    try {
      setLoading(true)
      
      if (userId === "guest") {
        // Load from localStorage for guest users
        const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null
        if (stored) {
          const guestCart = JSON.parse(stored)
          setCart(guestCart)
          // Calculate totals for guest cart
          calculateGuestCartTotals(guestCart)
        }
      } else {
        // Load from API for logged-in users
        const response = await fetch(`/api/cart?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setCart(data.items || [])
          setCartData(data)
        }
      }    } catch (error) {
      console.error("Failed to load cart:", error)
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function calculateGuestCartTotals(items: CartItem[]) {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = 0 // Free shipping
    const tax = subtotal * 0.07 // 7% tax
    const total = subtotal + shipping + tax
    
    setCartData({
      items,
      subtotal,
      shipping,
      tax,
      total
    })
  }

  async function addToCart(item: CartItem) {
    try {
      setLoading(true)
      
      if (userId === "guest") {
        // Handle guest users with localStorage
        setCart((prev) => {
          const existing = prev.find((i) => i.id === item.id && i.color === item.color)
          let newCart
          if (existing) {
            newCart = prev.map((i) =>
              i.id === item.id && i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          } else {
            newCart = [...prev, item]
          }          calculateGuestCartTotals(newCart)
          return newCart
        })
        toast({
          title: "Added to cart",
          description: `${item.name} has been added to your cart`,
        })
      } else {
        // API call for logged-in users
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            image: item.image,
            userId
          })
        })
          if (response.ok) {
          const data = await response.json()
          setCart(data.items || [])
          setCartData(data)
          toast({
            title: "Added to cart",
            description: `${item.name} has been added to your cart`,
          })
        } else {
          throw new Error("Failed to add to cart")
        }
      }    } catch (error) {
      console.error("Add to cart error:", error)
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function updateQuantity(id: string | number, color: string | undefined, quantity: number) {
    try {
      setLoading(true)
      
      if (userId === "guest") {
        setCart((prev) => {
          const newCart = prev.map((i) =>
            i.id === id && i.color === color ? { ...i, quantity: Math.max(1, quantity) } : i
          )
          calculateGuestCartTotals(newCart)
          return newCart
        })
      } else {
        const response = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: id,
            color,
            quantity,
            userId
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          setCart(data.items || [])
          setCartData(data)
        } else {
          throw new Error("Failed to update cart")
        }
      }    } catch (error) {
      console.error("Update cart error:", error)
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function removeFromCart(id: string | number, color: string | undefined) {
    try {
      setLoading(true)
        if (userId === "guest") {
        setCart((prev) => {
          const newCart = prev.filter((i) => !(i.id === id && i.color === color))
          calculateGuestCartTotals(newCart)
          return newCart
        })
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart",
        })
      } else {
        const response = await fetch(`/api/cart?productId=${id}&color=${color}&userId=${userId}`, {
          method: "DELETE"
        })
          if (response.ok) {
          const data = await response.json()
          setCart(data.items || [])
          setCartData(data)
          toast({
            title: "Removed from cart",
            description: "Item has been removed from your cart",
          })
        } else {
          throw new Error("Failed to remove from cart")
        }
      }    } catch (error) {
      console.error("Remove from cart error:", error)
      toast({
        title: "Error",
        description: "Failed to remove from cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function clearCart() {
    setCart([])
    setCartData(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart")
    }
  }
  return { 
    cart, 
    cartData,
    loading,
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    loadCart
  }
}
