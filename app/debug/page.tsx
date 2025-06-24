"use client"

import { useCart } from "@/hooks/use-modern-cart"
import { useWishlist } from "@/hooks/use-modern-wishlist"
import { Button } from "@/components/ui/button"

export default function CartDebugPage() {
  const { items: cartItems, addItem: addToCart, loading: cartLoading } = useCart()
  const { items: wishlistItems, addItem: addToWishlist, loading: wishlistLoading } = useWishlist()

  const testProduct = {
    productId: "test-product-123",
    name: "Test Glasses",
    price: 9999, // 99.99 in cents
    color: "Black",
    quantity: 1,
    image: "/placeholder.svg",
    category: "eyewear",
    inStock: true
  }

  const testWishlistProduct = {
    productId: "test-wishlist-123",
    name: "Test Wishlist Glasses",
    price: 12999, // 129.99 in cents
    color: "Blue",
    image: "/placeholder.svg",
    category: "eyewear",
    inStock: true
  }

  const handleAddToCart = async () => {
    console.log("🧪 Testing add to cart...")
    try {
      await addToCart(testProduct)
      console.log("✅ Add to cart successful")
    } catch (error) {
      console.error("❌ Add to cart failed:", error)
    }
  }

  const handleAddToWishlist = async () => {
    console.log("🧪 Testing add to wishlist...")
    try {
      await addToWishlist(testWishlistProduct)
      console.log("✅ Add to wishlist successful")
    } catch (error) {
      console.error("❌ Add to wishlist failed:", error)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Cart & Wishlist Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cart Debug */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cart Debug</h2>
          <p className="mb-2">Cart Items: {cartItems?.length || 0}</p>
          <p className="mb-4">Loading: {cartLoading ? "Yes" : "No"}</p>
          
          <Button 
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="mb-4"
          >
            Add Test Product to Cart
          </Button>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">Cart Items:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(cartItems, null, 2)}
            </pre>
          </div>
        </div>

        {/* Wishlist Debug */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Wishlist Debug</h2>
          <p className="mb-2">Wishlist Items: {wishlistItems?.length || 0}</p>
          <p className="mb-4">Loading: {wishlistLoading ? "Yes" : "No"}</p>
          
          <Button 
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className="mb-4"
          >
            Add Test Product to Wishlist
          </Button>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">Wishlist Items:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(wishlistItems, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* LocalStorage Debug */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">LocalStorage Debug</h2>
        <Button 
          onClick={() => {
            console.log("Cart localStorage:", localStorage.getItem('modern_cart'))
            console.log("Wishlist localStorage:", localStorage.getItem('modern_wishlist'))
          }}
          className="mb-4"
        >
          Check LocalStorage
        </Button>
        
        <Button 
          onClick={() => {
            localStorage.removeItem('modern_cart')
            localStorage.removeItem('modern_wishlist')
            window.location.reload()
          }}
          variant="destructive"
        >
          Clear LocalStorage & Reload
        </Button>
      </div>
    </div>
  )
}
