import { useState, useEffect } from "react"

export type CartItem = {
  id: string | number
  name: string
  price: number
  color?: string
  quantity: number
  image?: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null
    if (stored) setCart(JSON.parse(stored))
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  function addToCart(item: CartItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.color === item.color)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }

  function updateQuantity(id: string | number, color: string | undefined, quantity: number) {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.color === color ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    )
  }

  function removeFromCart(id: string | number, color: string | undefined) {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.color === color)))
  }

  function clearCart() {
    setCart([])
  }

  return { cart, addToCart, updateQuantity, removeFromCart, clearCart }
}
