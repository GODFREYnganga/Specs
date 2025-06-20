"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      // Check for token in localStorage (for non-admin users)
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      
      if (token) {
        // Verify token with server
        const response = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // Token is invalid, remove it
          localStorage.removeItem("token")
        }
      } else {
        // Check for admin session (HTTP-only cookie)
        const response = await fetch("/api/users/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    try {
      setLoading(true)
      
      // Try admin login first (uses HTTP-only cookies)
      const adminResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      if (adminResponse.ok) {
        const data = await adminResponse.json()
        setUser(data.user)
        return
      }
      
      // If admin login fails, try regular user login
      const userResponse = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      if (userResponse.ok) {
        const data = await userResponse.json()
        // Store token for regular users
        if (data.token) {
          localStorage.setItem("token", data.token)
        }
        setUser(data.user)
      } else {
        const errorData = await userResponse.json()
        throw new Error(errorData.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) {
    try {
      setLoading(true)
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, role: "user" }),
      })
      
      if (response.ok) {
        const data = await response.json()
        // Store token for regular users
        if (data.token) {
          localStorage.setItem("token", data.token)
        }
        setUser(data.user)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    
    // Remove token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    
    // Call logout endpoint to clear HTTP-only cookies
    fetch("/api/auth/logout", { method: "POST" })
    
    router.push("/")
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
