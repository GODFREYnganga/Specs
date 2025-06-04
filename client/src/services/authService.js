import api from "./api"

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      }
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      }
      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token")
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/user")
      return response.data
    } catch (error) {
      console.error("Error fetching user:", error)
      throw error
    }
  },
}
