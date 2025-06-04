"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, Heart, ShoppingCart, User } from "lucide-react"
import { StateContext } from "../../context/StateContext"
import "./Header.css"

function Header() {
  // State to track if the user has scrolled past the threshold
  const [isScrolled, setIsScrolled] = useState(false)

  // State to track if the header should be visible (for hide-on-scroll)
  const [isVisible, setIsVisible] = useState(true)

  // State to track the last scroll position for direction detection
  const [lastScrollY, setLastScrollY] = useState(0)

  // Get the current pathname for conditional styling
  const location = useLocation()
  const pathname = location.pathname

  // Access global state
  const { state } = useContext(StateContext)
  const { cart, auth } = state

  /**
   * Effect to handle scroll events for header visibility and styling
   */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine if scrolled past threshold (for background color change)
      setIsScrolled(currentScrollY > 50)

      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      // Update last scroll position
      setLastScrollY(currentScrollY)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Clean up event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Check if we're on the home page for conditional styling
  const isHomePage = pathname === "/"

  // Determine text color based on scroll position and current page
  const textColor = !isScrolled && isHomePage ? "text-white" : "text-gray-800"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? "bg-white shadow-md" : "bg-transparent"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Top Navbar - Contact information and links */}
      <div className="bg-white py-2 border-b">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-4">
              <span className="text-gray-600">Vision Redefined</span>
              <span className="text-gray-400">|</span>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">
                Store Locator
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/partner" className="text-gray-600 hover:text-gray-900">
                Partner With Us
              </Link>
            </div>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Navbar - Logo, search, and user actions */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold">Lens2Cart</h1>
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* User actions */}
            <div className="flex items-center space-x-6">
              <Link
                to={auth.isAuthenticated ? "/profile" : "/login"}
                className="flex items-center cursor-pointer group"
              >
                <User className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">
                  {auth.isAuthenticated ? auth.user.firstName : "Sign In & Sign Up"}
                </span>
              </Link>
              <Link to="/wishlist" className="flex items-center cursor-pointer group">
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">Wishlist</span>
              </Link>
              <Link to="/cart" className="flex items-center cursor-pointer group">
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900">
                  Cart {cart.items && cart.items.length > 0 && `(${cart.items.length})`}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navbar - Main navigation with dropdowns */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 py-4 text-sm font-medium flex-grow text-gray-800">
              {/* EYE GLASSES Dropdown */}
              <div className="group relative">
                <Link to="/products?category=eyeglasses" className="text-gray-800 hover:text-gray-600">
                  EYE GLASSES
                </Link>
                <div className="dropdown-menu">{/* Dropdown content would go here */}</div>
              </div>

              <Link to="/products?category=screen" className="text-gray-800 hover:text-gray-600">
                SCREEN GLASSES
              </Link>

              <Link to="/products?category=kids" className="text-gray-800 hover:text-gray-600">
                KIDS GLASSES
              </Link>

              {/* CONTACT LENSES Dropdown */}
              <div className="group relative">
                <Link to="/products?category=contact" className="text-gray-800 hover:text-gray-600">
                  CONTACT LENSES
                </Link>
                <div className="dropdown-menu">{/* Dropdown content would go here */}</div>
              </div>

              {/* SUNGLASSES Dropdown */}
              <div className="group relative">
                <Link to="/products?category=sunglasses" className="text-gray-800 hover:text-gray-600">
                  SUNGLASSES
                </Link>
                <div className="dropdown-menu">{/* Dropdown content would go here */}</div>
              </div>

              {/* HOME EYE-TEST Dropdown */}
              <div className="group relative">
                <Link to="/eye-test" className="text-gray-800 hover:text-gray-600">
                  HOME EYE-TEST
                </Link>
                <div className="dropdown-menu">{/* Dropdown content would go here */}</div>
              </div>

              {/* STORE LOCATOR Dropdown */}
              <div className="group relative">
                <Link to="/about" className="text-gray-800 hover:text-gray-600">
                  STORE LOCATOR
                </Link>
                <div className="dropdown-menu">{/* Dropdown content would go here */}</div>
              </div>
            </div>
            <Link to="/gold-membership" className="bg-gray-800 px-4 py-2 rounded">
              <span className="text-white font-medium">GOLD MEMBERSHIP</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
