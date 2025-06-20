"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search, Heart, ShoppingCart, User, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
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

  // Get the current pathname for conditional styling
  const pathname = usePathname()
  // Get auth state
  const { user, isAuthenticated, logout } = useAuth()
  
  // Get cart and wishlist counts
  const { cart } = useCart()
  const { wishlist } = useWishlist()

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
  const textColor = !isScrolled && isHomePage ? "text-white" : "text-gray-800"

  /**
   * Content for the eyewear dropdown menu
   * Contains categorized links for eyeglasses
   */
  const eyewearDropdownContent = (
    <div className="p-6 grid grid-cols-4 gap-8">
      {/* Gender Categories with Images */}
      <div>
        <h3 className="font-medium mb-4">Shop By Gender</h3>
        <div className="grid gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/images/people/man-glasses.png" alt="Men" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=eye-glasses&gender=men" className="text-sm hover:text-gray-900">
              Men
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/images/people/woman-glasses.png" alt="Women" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=eye-glasses&gender=women" className="text-sm hover:text-gray-900">
              Women
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/images/people/kid-glasses.png" alt="Kids" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=kids-glasses" className="text-sm hover:text-gray-900">
              Kids
            </Link>
          </div>
        </div>
      </div>

      {/* Our Top Picks */}
      <div>
        <h3 className="font-medium mb-4">Our Top Picks</h3>
        <div className="grid gap-2 text-sm">
          <Link href="/products?category=eye-glasses&topPick=new-arrivals" className="hover:text-gray-900">
            New Arrivals
          </Link>
          <Link href="/products?category=eye-glasses&topPick=best-sellers" className="hover:text-gray-900">
            Best Sellers
          </Link>
          <Link href="/products?category=eye-glasses&topPick=progressive-eyeglasses" className="hover:text-gray-900">
            Progressive Eyeglasses
          </Link>
        </div>
      </div>

      {/* Frame Types */}
      <div>
        <h3 className="font-medium mb-4">Frame Type</h3>
        <div className="grid gap-2 text-sm">
          <Link href="/products?category=eye-glasses&frameType=rectangle-frames" className="hover:text-gray-900">
            Rectangle Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=square-frames" className="hover:text-gray-900">
            Square Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=round-frames" className="hover:text-gray-900">
            Round Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=cat-eye-frames" className="hover:text-gray-900">
            Cat Eye Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=wayfarer-frames" className="hover:text-gray-900">
            Wayfarer Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=geometric-frames" className="hover:text-gray-900">
            Geometric Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=aviator-frames" className="hover:text-gray-900">
            Aviator Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=halfrim-frames" className="hover:text-gray-900">
            Halfrim Frames
          </Link>
          <Link href="/products?category=eye-glasses&frameType=rimless-frames" className="hover:text-gray-900">
            Rimless Frames
          </Link>
        </div>
      </div>

      {/* Collections & Brands */}
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Collection</h3>
          <div className="grid gap-2 text-sm">
            <Link href="/products?category=eye-glasses&style=matte-classics" className="hover:text-gray-900">
              Matte Classics
            </Link>
            <Link href="/products?category=eye-glasses&style=urban-steel" className="hover:text-gray-900">
              Urban Steel
            </Link>
            <Link href="/products?category=eye-glasses&style=acetate-classics" className="hover:text-gray-900">
              Acetate Classics
            </Link>
            <Link href="/products?category=eye-glasses&style=youth-trends" className="hover:text-gray-900">
              Youth Trends
            </Link>
            <Link href="/products?category=eye-glasses&style=bold-patterns" className="hover:text-gray-900">
              Bold Patterns
            </Link>
            <Link href="/products?category=eye-glasses&style=modern-minimal" className="hover:text-gray-900">
              Modern Minimal
            </Link>
            <Link href="/products?category=eye-glasses&style=everyday-comfort" className="hover:text-gray-900">
              Everyday Comfort
            </Link>
            <Link href="/products?category=eye-glasses&style=executive-edit" className="hover:text-gray-900">
              Executive Edit
            </Link>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-4">Brands</h3>
          <div className="grid gap-2 text-sm">
            <Link href="/products?category=eye-glasses&brand=fashionista-classic" className="hover:text-gray-900">
              Fashionista Classic
            </Link>
            <Link href="/products?category=eye-glasses&brand=magneto-kids-classic" className="hover:text-gray-900">
              Magneto Kids Classic
            </Link>
            <Link href="/products?category=eye-glasses&brand=magneto-kids-premium" className="hover:text-gray-900">
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
    <div className="p-6 grid grid-cols-5 gap-8">
      {/* Brands */}
      <div>
        <h3 className="font-medium mb-4">Brands</h3>
        <div className="grid gap-2 text-sm">
          <Link href="#" className="hover:text-gray-900">
            Aqualens
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Bausch Lamb
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Softlens
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Acuvue
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Iconnect
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Alcon
          </Link>
        </div>
      </div>

      {/* Disposability */}
      <div>
        <h3 className="font-medium mb-4">Explore By Disposability</h3>
        <div className="grid gap-2 text-sm">
          <Link href="#" className="hover:text-gray-900">
            Monthly
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Day & Night
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Daily
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Yearly
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Bi-Weekly
          </Link>
        </div>
      </div>

      {/* Power */}
      <div>
        <h3 className="font-medium mb-4">Explore By Power</h3>
        <div className="grid gap-2 text-sm">
          <Link href="#" className="hover:text-gray-900">
            Spherical - (CYL&lt;0.5)
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Spherical + (CYL&lt;0.5)
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Cylindrical Power (&gt;0.75)
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Toric Power
          </Link>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-medium mb-4">Explore By Color</h3>
        <div className="grid gap-2 text-sm">
          <Link href="#" className="hover:text-gray-900">
            Green
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Blue
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Brown
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Turquoise
          </Link>
          <Link href="#" className="hover:text-gray-900">
            View all Colors
          </Link>
        </div>
      </div>

      {/* Solution */}
      <div>
        <h3 className="font-medium mb-4">Solution</h3>
        <div className="grid gap-2 text-sm">
          <Link href="#" className="hover:text-gray-900">
            Small
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Large
          </Link>
          <Link href="#" className="hover:text-gray-900">
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
    <div className="p-8 text-center">
      <h3 className="text-2xl font-bold mb-2">Your One Stop Shop</h3>
      <p className="text-lg mb-1">For Eye wear Perfection</p>
      <p className="text-gray-600 mb-4">
        Experience eyewear in a whole new way: Visit your
        <br />
        nearest store
        <br />
        and treat yourself to 5000+ eyewear styles
      </p>
      <Link href="/about">
        <button className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition">
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
    <div className="p-6 grid grid-cols-2 gap-8">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <img src="/images/people/eye-exam.png" alt="Eye Test" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xl mb-1">
          Get your eyes checked at
          <br />
          home
        </p>
        <div className="my-6">
          <p className="text-gray-600">
            A certified refractionist will visit
            <br />
            you with latest eye testing machines &<br />
            100 trial frames
          </p>
        </div>
        <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed">Coming Soon</button>
      </div>
    </div>
  )

  /**
   * Content for the sunglasses dropdown menu
   * Contains categorized links for sunglasses
   */
  const sunglassesDropdownContent = (
    <div className="p-6 grid grid-cols-4 gap-8">
      {/* Gender Categories with Images */}
      <div>
        <h3 className="font-medium mb-4">Shop By Gender</h3>
        <div className="grid gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/images/people/man-glasses.png" alt="Men" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=sunglasses&gender=men" className="text-sm hover:text-gray-900">
              Men
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/images/people/woman-glasses.png" alt="Women" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=sunglasses&gender=women" className="text-sm hover:text-gray-900">
              Women
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/images/people/kid-glasses.png" alt="Kids" className="w-full h-full object-cover" />
            </div>
            <Link href="/products?category=sunglasses&gender=kids" className="text-sm hover:text-gray-900">
              Kids
            </Link>
          </div>
        </div>
      </div>

      {/* Our Top Picks */}
      <div>
        <h3 className="font-medium mb-4">Our Top Picks</h3>
        <div className="grid gap-2 text-sm">
          <Link href="/products?category=sunglasses&topPick=polarized" className="hover:text-gray-900">
            Polarized
          </Link>
          <Link href="/products?category=sunglasses&topPick=mirrored" className="hover:text-gray-900">
            Mirrored
          </Link>
          <Link href="/products?category=sunglasses&topPick=oversized" className="hover:text-gray-900">
            Oversized
          </Link>
        </div>
      </div>

      {/* Frame Types */}
      <div>
        <h3 className="font-medium mb-4">Frame Type</h3>
        <div className="grid gap-2 text-sm">
          <Link href="/products?category=sunglasses&frameType=rectangle-frames" className="hover:text-gray-900">
            Rectangle Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=square-frames" className="hover:text-gray-900">
            Square Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=round-frames" className="hover:text-gray-900">
            Round Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=cat-eye-frames" className="hover:text-gray-900">
            Cat Eye Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=wayfarer-frames" className="hover:text-gray-900">
            Wayfarer Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=geometric-frames" className="hover:text-gray-900">
            Geometric Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=aviator-frames" className="hover:text-gray-900">
            Aviator Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=halfrim-frames" className="hover:text-gray-900">
            Halfrim Frames
          </Link>
          <Link href="/products?category=sunglasses&frameType=rimless-frames" className="hover:text-gray-900">
            Rimless Frames
          </Link>
        </div>
      </div>

      {/* Collections & Brands */}
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Collection</h3>
          <div className="grid gap-2 text-sm">
            <Link href="/products?category=sunglasses&style=beach-collection" className="hover:text-gray-900">
              Beach Collection
            </Link>
            <Link href="/products?category=sunglasses&style=urban-explorer" className="hover:text-gray-900">
              Urban Explorer
            </Link>
            <Link href="/products?category=sunglasses&style=driving-series" className="hover:text-gray-900">
              Driving Series
            </Link>
            <Link href="/products?category=sunglasses&style=luxury-line" className="hover:text-gray-900">
              Luxury Line
            </Link>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-4">Brands</h3>
          <div className="grid gap-2 text-sm">
            <Link href="/products?category=sunglasses&brand=sunpro" className="hover:text-gray-900">
              SunPro
            </Link>
            <Link href="/products?category=sunglasses&brand=raystyle" className="hover:text-gray-900">
              RayStyle
            </Link>
            <Link href="/products?category=sunglasses&brand=coastal" className="hover:text-gray-900">
              Coastal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHomePage ? "bg-white shadow-md" : "bg-transparent"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Top Navbar - Contact information and links */}
      <div className="bg-gray-100 py-2 border-b">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-4">
              <span className="text-black">Vision Redefined</span>
              <span className="text-gray-600">|</span>
              <Link href="/about" className="text-black hover:text-gray-900">
                Store Locator
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/partner" className="text-black hover:text-gray-900">
                Partner With Us
              </Link>
            </div>
            <Link href="/contact" className="text-black hover:text-gray-900">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Navbar - Logo, search, and user actions */}
      <div className="bg-blue-950 py-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={settings?.general?.storeLogo || "/images/hero/lens2cart-logo.png"}
                alt="Lens2Cart Logo"
                width={300}
                height={100}
                className="h-auto"
                priority
              />
            </Link>

            {/* Search bar */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-2xl px-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>            {/* User actions */}
            <div className="w-full flex justify-end">
              <div className="flex items-center space-x-6">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center cursor-pointer group">
                      <User className="w-5 h-5 text-white group-hover:text-gray-900" />
                      <span className="ml-2 text-sm text-white group-hover:text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                    <Button
                      onClick={logout}
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-white hover:text-gray-900 hover:bg-white/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center cursor-pointer group">
                    <User className="w-5 h-5 text-white group-hover:text-gray-900" />
                    <span className="ml-2 text-sm text-white group-hover:text-gray-900">Sign In & Sign Up</span>
                  </Link>
                )}                <Link href="/wishlist" className="flex items-center cursor-pointer group relative">
                  <Heart className="w-5 h-5	text-white group-hover:text-gray-900" />
                  <span className="ml-2 text-sm text-white group-hover:text-gray-900">Wishlist</span>
                  {wishlist && wishlist.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {wishlist.length}
                    </Badge>
                  )}
                </Link>
                <Link href="/cart" className="flex items-center cursor-pointer group relative">
                  <ShoppingCart className="w-5 h-5 text-white group-hover:text-gray-900" />
                  <span className="ml-2 text-sm text-white group-hover:text-gray-900">Cart</span>
                  {cart && cart.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {cart.length}
                    </Badge>
                  )}
                </Link>                {user?.role === "admin" && (
                  <Link href="/admin" className="flex items-center cursor-pointer group">
                    <span className="ml-2 text-sm text-white group-hover:text-gray-900 font-semibold">Admin</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navbar - Main navigation with dropdowns */}
      <div className="bg-[#FF6600] border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
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
      </div>
    </nav>
  )
}
