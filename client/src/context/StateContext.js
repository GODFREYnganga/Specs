"use client"

import { createContext, useContext, useReducer, useEffect } from "react"

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  cart: { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 },
  products: [],
  loading: false,
  error: null,
}

// Create context
const StateContext = createContext()

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    // Auth actions
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      }

    // Product actions
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        loading: false,
      }
    case "PRODUCT_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    // Cart actions
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        loading: false,
      }
    case "ADD_TO_CART_SUCCESS":
      return {
        ...state,
        cart: action.payload,
        loading: false,
      }
    case "REMOVE_FROM_CART_SUCCESS":
      return {
        ...state,
        cart: action.payload,
        loading: false,
      }
    case "UPDATE_CART_SUCCESS":
      return {
        ...state,
        cart: action.payload,
        loading: false,
      }
    case "CLEAR_CART":
      return {
        ...state,
        cart: { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 },
      }

    // Loading states
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      }

    default:
      return state
  }
}

// Provider component
export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const cart = localStorage.getItem("cart")
    if (cart) {
      dispatch({ type: "SET_CART", payload: JSON.parse(cart) })
    }

    // Check for stored auth token
    const token = localStorage.getItem("token")
    if (token) {
      // Fetch user data with token
      fetchUserData(token, dispatch)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart))
  }, [state.cart])

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>
}

// Custom hook to use the state context
export const useStateContext = () => useContext(StateContext)

// Helper function to fetch user data with token
const fetchUserData = async (token, dispatch) => {
  try {
    const response = await fetch("/api/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const userData = await response.json()
      dispatch({ type: "LOGIN_SUCCESS", payload: userData })
    } else {
      // If token is invalid, remove it
      localStorage.removeItem("token")
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    localStorage.removeItem("token")
  }
}
