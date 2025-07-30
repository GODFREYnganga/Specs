"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search, Heart, ShoppingCart, User, LogOut, Menu, X } from "lucide-react" // Added Menu and X icons
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-modern-cart"
import { useWishlist } from "@/hooks/use-modern-wishlist"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Header Component
 *
 * Main navigation component with responsive behavior and dropdown menus.
 * Features hide-on-scroll functionality and dynamic styling based on scroll position.
 */
export function Header() {
  // State to track if the user has scrolled past the threshold
  const [isScrolled, setIsScrolled] = useState(false)

  // State to track if the header should be visible (for hide-on-scroll)
  const [isVisible, setIsVisible] = useState(true)

  // State to track the last scroll position for direction detection
  const [lastScrollY, setLastScrollY] = useState(0)

  // State for mobile menu open/close
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Set scroll state for text color, etc.
      setIsScrolled(currentScrollY > 50)

      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false) // scrolling down
      } else {
        setIsVisible(true) // scrolling up
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // 👇 Add this here, after useEffect
  const bottomNavbarTop = isVisible ? 136 : 30

  // Get the current pathname for conditional styling
  const pathname = usePathname()

  // Get auth state
  const { user, isAuthenticated, logout } = useAuth()

  // Get cart and wishlist counts
  const { items } = useCart()
  const { items: wishlistItems } = useWishlist()

  // Calculate total cart quantity (not just number of unique items)
  const cartCount = items && items.length > 0 ? items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) : 0
  const wishlistCount = wishlistItems && wishlistItems.length > 0 ? wishlistItems.length : 0

  // Debug logging - consider removing in production
  // console.log("🎯 Header - Cart:", items)
  // console.log("🔢 Header - Cart count:", cartCount)

  // State to store settings fetched from the API
  const [settings, setSettings] = useState<any>(null)
  // Helper to fetch settings
  const fetchSettings = () => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => setSettings(null))
  }
  useEffect(() => {
    fetchSettings()
    // Listen for logo update events (localStorage)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'storeLogoUpdated') fetchSettings()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Check if we're on the home page for conditional styling
  const isHomePage = pathname === "/"

  // Determine text color based on scroll position and current page
  // This is used for the previous text-white/text-gray-800 logic,
  // but for responsive purposes, we'll override for mobile
  const textColor = !isScrolled && isHomePage ? "text-white" : "text-gray-800"

  // Function to close mobile menu
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  /**
   * Content for the eyewear dropdown menu
   * Contains categorized links for eyeglasses
   */
  const eyewearDropdownContent = (
    <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {/* Gender Categories with Images */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Shop By Gender</h3>
        <div className="grid gap-2 md:gap-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
              <img src="/images/people/man-glasses.png" alt="Men" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=eye-glasses&gender=men" className="text-xs md:text-sm hover:text-gray-900" onClick={closeMobileMenu}>
              Men
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
              <img src="/images/people/woman-glasses.png" alt="Women" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=eye-glasses&gender=women" className="text-xs md:text-sm hover:text-gray-900" onClick={closeMobileMenu}>
              Women
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
              <img src="/images/people/kid-glasses.png" alt="Kids" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=kids-glasses" className="text-xs md:text-sm hover:text-gray-900" onClick={closeMobileMenu}>
              Kids
            </Link>
          </div>
        </div>
      </div>

      {/* Our Top Picks */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Our Top Picks</h3>
        <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
          <Link href="/products?category=eye-glasses&topPick=new-arrivals" className="hover:text-gray-900" onClick={closeMobileMenu}>
            New Arrivals
          </Link>
          <Link href="/products?category=eye-glasses&topPick=best-sellers" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Best Sellers
          </Link>
          <Link href="/products?category=eye-glasses&topPick=progressive-eyeglasses" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Progressive Eyeglasses
          </Link>
        </div>
      </div>

      {/* Frame Types */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Frame Type</h3>
        <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
          <Link href="/products?category=eye-glasses&frameType=rectangle-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Rectangle Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=square-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Square Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=round-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Round Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=cat-eye-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Cat Eye Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=wayfarer-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Wayfarer Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=geometric-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Geometric Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=aviator-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Aviator Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=halfrim-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Halfrim Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=rimless-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Rimless Frames
          </Link>
        </div>
      </div>

      {/* Collections & Brands */}
      <div className="space-y-4 md:space-y-6">
        <div>
          <h3 className="font-medium mb-2 md:mb-4">Collection</h3>
          <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
            <Link href="/products?category=eye-glasses&style=matte-classics" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Matte Classics
            </Link>
            <Link href="/products?category=eye-glasses&style=urban-steel" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Urban Steel
            </Link>
            <Link href="/products?category=eye-glasses&style=acetate-classics" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Acetate Classics
            </Link>
            <Link href="/products?category=eye-glasses&style=youth-trends" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Youth Trends
            </Link>
            <Link href="/products?category=eye-glasses&style=bold-patterns" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Bold Patterns
            </Link>
            <Link href="/products?category=eye-glasses&style=modern-minimal" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Modern Minimal
            </Link>
            <Link href="/products?category=eye-glasses&style=everyday-comfort" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Everyday Comfort
            </Link>
            <Link href="/products?category=eye-glasses&style=executive-edit" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Executive Edit
            </Link>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2 md:mb-4">Brands</h3>
          <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
            <Link href="/products?category=eye-glasses&brand=fashionista-classic" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Fashionista Classic
            </Link>
            <Link href="/products?category=eye-glasses&brand=magneto-kids-classic" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Magneto Kids Classic
            </Link>
            <Link href="/products?category=eye-glasses&brand=magneto-kids-premium" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Magneto Kids Premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Content for the contact lenses dropdown menu
   * Contains categorized links for contact lenses
   */
  const contactLensesDropdownContent = (
    <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
      {/* Brands */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Brands</h3>
        <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Aqualens
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Bausch Lamb
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Softlens
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Acuvue
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Iconnect
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Alcon
          </Link>
        </div>
      </div>

      {/* Disposability */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Explore By Disposability</h3>
        <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Monthly
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Day & Night
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Daily
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Yearly
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Bi-Weekly
          </Link>
        </div>
      </div>

      {/* Power */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Explore By Power</h3>
        <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Spherical - (CYL&lt;0.5)
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Spherical + (CYL&lt;0.5)
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Cylindrical Power (&gt;0.75)
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Toric Power
          </Link>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Explore By Color</h3>
        <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Green
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Blue
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Brown
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Turquoise
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            View all Colors
          </Link>
        </div>
      </div>

      {/* Solution */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Solution</h3>
        <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Small
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Large
          </Link>
          <Link href="#" className="hover:text-gray-900" onClick={closeMobileMenu}>
            View all Solutions
          </Link>
        </div>
      </div>
    </div>
  )

  /**
   * Content for the store locator dropdown menu
   * Contains information about physical store locations
   */
  const storeLocatorDropdownContent = (
    <div className="p-4 md:p-8 text-center">
      <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Your One Stop Shop</h3>
      <p className="text-base md:text-lg mb-1">For Eye wear Perfection</p>
      <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-4">
        Experience eyewear in a whole new way: Visit your
        <br />
        nearest store
        <br />
        and treat yourself to 5000+ eyewear styles
      </p>
      <Link href="/about" onClick={closeMobileMenu}>
        <button className="px-4 py-2 md:px-6 md:py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition text-sm md:text-base">
          Learn More About Us
        </button>
      </Link>
    </div>
  )

  /**
   * Content for the home eye test dropdown menu
   * Contains information about at-home eye testing services
   */
  const homeEyeTestDropdownContent = (
    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      <div className="bg-gray-100 rounded-lg overflow-hidden hidden md:block"> {/* Hide image on small screens */}
        <img src="/images/people/eye-exam.png" alt="Eye Test" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-center text-center md:text-left">
        <p className="text-lg md:text-xl mb-1">
          Get your eyes checked at
          <br />
          home
        </p>
        <div className="my-3 md:my-6">
          <p className="text-gray-600 text-sm md:text-base">
            A certified refractionist will visit
            <br />
            you with latest eye testing machines &<br />
            100 trial frames
          </p>
        </div>
        <button className="px-4 py-2 md:px-6 md:py-3 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed text-sm md:text-base">Coming Soon</button>
      </div>
    </div>
  )

  /**
   * Content for the sunglasses dropdown menu
   * Contains categorized links for sunglasses
   */
  const sunglassesDropdownContent = (
    <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {/* Gender Categories with Images */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Shop By Gender</h3>
        <div className="grid gap-2 md:gap-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
              <img src="/images/people/man-glasses.png" alt="Men" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=sunglasses&gender=men" className="text-xs md:text-sm hover:text-gray-900" onClick={closeMobileMenu}>
              Men
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
              <img src="/images/people/woman-glasses.png" alt="Women" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=sunglasses&gender=women" className="text-xs md:text-sm hover:text-gray-900" onClick={closeMobileMenu}>
              Women
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
              <img src="/images/people/kid-glasses.png" alt="Kids" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=sunglasses&gender=kids" className="text-xs md:text-sm hover:text-gray-900" onClick={closeMobileMenu}>
              Kids
            </Link>
          </div>
        </div>
      </div>

      {/* Our Top Picks */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Our Top Picks</h3>
        <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
          <Link href="/products?category=sunglasses&topPick=polarized" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Polarized
          </Link>
          <Link href="/products?category=sunglasses&topPick=mirrored" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Mirrored
          </Link>
          <Link href="/products?category=sunglasses&topPick=oversized" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Oversized
          </Link>
        </div>
      </div>

      {/* Frame Types */}
      <div>
        <h3 className="font-medium mb-2 md:mb-4">Frame Type</h3>
        <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
          <Link href="/products?category=sunglasses&frameType=rectangle-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Rectangle Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=square-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Square Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=round-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Round Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=cat-eye-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Cat Eye Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=wayfarer-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Wayfarer Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=geometric-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Geometric Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=aviator-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Aviator Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=halfrim-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Halfrim Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=rimless-frames" className="hover:text-gray-900" onClick={closeMobileMenu}>
            Rimless Frames
          </Link>
        </div>
      </div>

      {/* Collections & Brands */}
      <div className="space-y-4 md:space-y-6">
        <div>
          <h3 className="font-medium mb-2 md:mb-4">Collection</h3>
          <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
            <Link href="/products?category=sunglasses&style=beach-collection" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Beach Collection
            </Link>
            <Link href="/products?category=sunglasses&style=urban-explorer" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Urban Explorer
            </Link>
            <Link href="/products?category=sunglasses&style=driving-series" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Driving Series
            </Link>
            <Link href="/products?category=sunglasses&style=luxury-line" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Luxury Line
            </Link>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2 md:mb-4">Brands</h3>
          <div className="grid gap-1 md:gap-2 text-xs md:text-sm">
            <Link href="/products?category=sunglasses&brand=sunpro" className="hover:text-gray-900" onClick={closeMobileMenu}>
              SunPro
            </Link>
            <Link href="/products?category=sunglasses&brand=raystyle" className="hover:text-gray-900" onClick={closeMobileMenu}>
              RayStyle
            </Link>
            <Link href="/products?category=sunglasses&brand=coastal" className="hover:text-gray-900" onClick={closeMobileMenu}>
              Coastal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Top Navbar - Contact information and links */}
      <div className="fixed top-0 left-0 w-full z-50 bg-gray-100 py-1 md:py-2 border-b">
        <div className="w-full px-4 max-w-[1800px] mx-auto">
          <div className="flex justify-between items-center text-xs md:text-sm text-black">
            {/* Left side items */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="hidden sm:inline">Vision Redefined</span> {/* Hidden on smaller screens */}
              <span className="text-gray-600 hidden sm:inline">|</span> {/* Hidden on smaller screens */}
              <Link href="/about" className="hover:text-gray-900">
                Store Locator
              </Link>
              <span className="text-gray-400 hidden sm:inline">|</span> {/* Hidden on smaller screens */}
              <Link href="/partner" className="hover:text-gray-900">
                Partner With Us
              </Link>
            </div>

            {/* Right side item */}
            <Link href="/contact" className="hover:text-gray-900">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="h-[0.5px]" />

      {/* Middle Navbar - Logo, search, and user actions */}
      <div
        className={`
          h-50
          sticky z-10
          bg-blue-950 shadow
          transition-transform duration-300 ease-in-out
          ${isVisible ? "top-[40px] md:top-[40px] h-auto opacity-100 translate-y-0" : "top-[40px] opacity-0 -translate-y-full"}
        `}
      >
        <div className="bg-blue-950">
          <div className="container w-full px-4 md:px-8 lg:px-50 max-w-[1800px] mx-auto">
            <div className="flex items-center justify-between py-4 md:py-8 ">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <div className="flex items-center justify-start">
                  <Image
                    src="/images/hero/logo.png"
                    alt="Logo"
                    width={150} // Smaller on mobile
                    height={100} // Smaller on mobile
                    className="md:w-[400px] md:h-[100px]" // Larger on desktop
                    priority
                  />
                </div>
              </Link>

              {/* Search bar - Hidden on mobile, shown on medium screens and up */}
              <div className="hidden md:flex w-full justify-center">
                <div className="w-full max-w-6xl px-4 lg:pl-80">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* User actions / Mobile Menu Toggle */}
              <div className="flex items-center space-x-4 md:space-x-6">
                {/* Mobile Search Icon */}
                <Search className="w-5 h-5 text-white md:hidden" />

                {isAuthenticated && user ? (
                  <>
                    <div className="hidden md:flex items-center cursor-pointer group">
                      <User className="w-5 h-5 text-white group-hover:text-gray-900" />
                      <span className="ml-2 text-sm text-white group-hover:text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                    <Button
                      onClick={logout}
                      variant="ghost"
                      size="sm"
                      className="hidden md:flex items-center text-white hover:text-gray-900 hover:bg-white/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="hidden md:flex items-center cursor-pointer group">
                    <User className="w-5 h-5 text-white group-hover:text-gray-900" />
                    <span className="ml-2 text-sm text-white group-hover:text-gray-900">Sign In & Sign Up</span>
                  </Link>
                )}
                <Link href="/wishlist/modern" className="flex items-center cursor-pointer group relative">
                  <Heart className="w-5 h-5 text-white group-hover:text-gray-900" />
                  <span className="ml-2 text-sm text-white group-hover:text-gray-900 hidden md:inline">Wishlist</span> {/* Hide text on mobile */}
                  {wishlistCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Link>
                <Link href="/cart/modern" className="flex items-center cursor-pointer group relative">
                  <ShoppingCart className="w-5 h-5 text-white group-hover:text-gray-900" />
                  <span className="ml-2 text-sm text-white group-hover:text-gray-900 hidden md:inline">Cart</span> {/* Hide text on mobile */}
                  {cartCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" className="flex items-center cursor-pointer group">
                    <span className="ml-2 text-sm text-white group-hover:text-gray-900 font-semibold hidden md:inline">Admin</span> {/* Hide text on mobile */}
                  </Link>
                )}

                {/* Mobile Menu Toggle Button */}
                <button
                  className="md:hidden text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[0.5px]" />

      {/* Bottom Navbar - Main navigation with dropdowns (Desktop) */}
      <nav
        className="hidden md:block p-40px z-40 h-15 bg-[#FF6600] border-t border-gray-200 transition-all duration-300 ease-in-out"
        style={{
          position: "sticky",
          top: `${bottomNavbarTop}px`
        }}>
        <div className="container mx-auto px-4 md:px-8 w-full">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 py-4 text-sm font-medium flex-grow text-gray-800">
              {/* EYE GLASSES Dropdown */}
              <div className="group relative">
                <Link href="/products?category=eye-glasses" className="text-white hover:text-gray-600">
                  EYE GLASSES
                </Link>
                <div className="absolute left-0 top-full w-[800px] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  {eyewearDropdownContent}
                </div>
              </div>

              <Link href="/products?category=blue-light-glasses" className="text-white hover:text-gray-600">
                SCREEN GLASSES
              </Link>

              <Link href="/products?category=kids-glasses" className="text-white hover:text-gray-600">
                KIDS GLASSES
              </Link>

              {/* CONTACT LENSES Dropdown */}
              <div className="group relative">
                <Link href="/products?category=services" className="text-white hover:text-gray-600">
                  CONTACT LENSES
                </Link>
                <div className="absolute left-0 top-full w-[800px] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  {contactLensesDropdownContent}
                </div>
              </div>

              {/* SUNGLASSES Dropdown */}
              <div className="group relative">
                <Link href="/products?category=sunglasses" className="text-white hover:text-gray-600">
                  SUNGLASSES
                </Link>
                <div className="absolute left-0 top-full w-[800px] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  {sunglassesDropdownContent}
                </div>
              </div>

              {/* HOME EYE-TEST Dropdown */}
              <div className="group relative">
                <Link href="/eye-test" className="text-white hover:text-gray-600">
                  HOME EYE-TEST
                </Link>
                <div className="absolute left-0 top-full w-[600px] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  {homeEyeTestDropdownContent}
                </div>
              </div>

              {/* STORE LOCATOR Dropdown */}
              <div className="group relative">
                <Link href="/about" className="text-white hover:text-gray-600">
                  STORE LOCATOR
                </Link>
                <div className="absolute left-0 top-full w-[400px] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  {storeLocatorDropdownContent}
                </div>
              </div>
            </div>
            <Link href="/gold-membership" className="bg-gray-800 px-4 py-2 rounded">
              <span className="text-yellow-400 font-medium">GOLD MEMBERSHIP</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 z-50 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="w-64 bg-white h-full shadow-lg p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close mobile menu">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            {/* Mobile User/Auth Links */}
            {isAuthenticated && user ? (
              <>
                <Link href="/profile" className="flex items-center text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
                  <User className="w-5 h-5 mr-2" />
                  <span>{user.firstName} {user.lastName}</span>
                </Link>
                <Button
                  onClick={() => { logout(); closeMobileMenu(); }}
                  variant="ghost"
                  className="flex items-center justify-start text-gray-800 hover:text-blue-950 px-0"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" className="flex items-center text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
                <User className="w-5 h-5 mr-2" />
                Sign In & Sign Up
              </Link>
            )}

            <Link href="/products?category=eye-glasses" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              EYE GLASSES
            </Link>
            <Link href="/products?category=blue-light-glasses" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              SCREEN GLASSES
            </Link>
            <Link href="/products?category=kids-glasses" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              KIDS GLASSES
            </Link>
            <Link href="/products?category=services" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              CONTACT LENSES
            </Link>
            <Link href="/products?category=sunglasses" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              SUNGLASSES
            </Link>
            <Link href="/eye-test" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              HOME EYE-TEST
            </Link>
            <Link href="/about" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              STORE LOCATOR
            </Link>
            <Link href="/gold-membership" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              GOLD MEMBERSHIP
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="text-gray-800 hover:text-blue-950 font-semibold" onClick={closeMobileMenu}>
                Admin Dashboard
              </Link>
            )}
            <Link href="/contact" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              Contact Us
            </Link>
            <Link href="/partner" className="text-gray-800 hover:text-blue-950" onClick={closeMobileMenu}>
              Partner With Us
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}