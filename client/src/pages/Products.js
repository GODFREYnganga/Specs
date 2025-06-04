"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { getProducts } from "../services/productService"
import ProductQuickView from "../components/ProductQuickView"
import { useStateContext } from "../context/StateContext"
import "./Products.css"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    sortBy: "newest",
  })

  const location = useLocation()
  const { addToCart } = useStateContext()

  useEffect(() => {
    // Extract category from URL query params if present
    const params = new URLSearchParams(location.search)
    const categoryParam = params.get("category")

    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }))
    }

    fetchProducts()
  }, [location.search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError("Failed to load products. Please try again later.")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickView = (product) => {
    setSelectedProduct(product)
  }

  const closeQuickView = () => {
    setSelectedProduct(null)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Apply filters and sorting
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number)
      if (product.price < min || (max && product.price > max)) {
        return false
      }
    }

    return true
  })

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Our Eyewear Collection</h1>

        <div className="products-layout">
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-select">
                <option value="">All Categories</option>
                <option value="eyeglasses">Eyeglasses</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="reading">Reading Glasses</option>
                <option value="blue-light">Blue Light Glasses</option>
              </select>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Prices</option>
                <option value="0-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-">$200 & Above</option>
              </select>
            </div>

            <div className="filter-section">
              <h3>Sort By</h3>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="filter-select">
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </aside>

          <div className="products-grid">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : sortedProducts.length === 0 ? (
              <div className="no-products-message">No products found matching your criteria.</div>
            ) : (
              <div className="products-grid-inner">
                {sortedProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-image-container">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
                      <button className="quick-view-button" onClick={() => handleQuickView(product)}>
                        Quick View
                      </button>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">${product.price.toFixed(2)}</p>
                      <button
                        className="add-to-cart-button"
                        onClick={() =>
                          handleAddToCart({
                            ...product,
                            quantity: 1,
                            selectedSize: "Medium",
                          })
                        }
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductQuickView product={selectedProduct} onClose={closeQuickView} onAddToCart={handleAddToCart} />
      )}
    </div>
  )
}

export default Products
