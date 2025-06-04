import api from "./api"

export const cartService = {
  // Get cart
  getCart: async () => {
    try {
      const response = await api.get("/cart")
      return response.data
    } catch (error) {
      console.error("Error fetching cart:", error)
      throw error
    }
  },

  // Add item to cart
  addToCart: async (item) => {
    try {
      const response = await api.post("/cart", item)
      return response.data
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  },

  // Update cart item
  updateCartItem: async (item) => {
    try {
      const response = await api.put("/cart", item)
      return response.data
    } catch (error) {
      console.error("Error updating cart item:", error)
      throw error
    }
  },

  // Remove item from cart
  removeFromCart: async (id, color) => {
    try {
      const response = await api.delete(`/cart?id=${id}&color=${color}`)
      return response.data
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  },
}
