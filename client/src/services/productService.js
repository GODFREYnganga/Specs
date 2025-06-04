import api from "./api"

export const productService = {
  // Get all products
  getProducts: async (category = "") => {
    try {
      const url = category ? `/products?category=${category}` : "/products"
      const response = await api.get(url)
      return response.data
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error)
      throw error
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await api.get(`/products/search?q=${query}`)
      return response.data
    } catch (error) {
      console.error("Error searching products:", error)
      throw error
    }
  },
}
