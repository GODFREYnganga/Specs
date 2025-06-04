"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { FaStar, FaArrowLeft, FaCheck, FaHeart, FaShoppingCart } from "react-icons/fa"
import { useStateContext } from "../context/StateContext"
import { productService } from "../services/productService"
import { cartService } from "../services/cartService"
import "./ProductDetail.css"

function ProductDetail() {
  const { id } = useParams()
  const { state, dispatch } = useStateContext()
  const [product, setProduct] = useState(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productService.getProductById(id)
        setProduct(data)
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
        }
        setLoading(false)
      } catch (err) {
        setError("Failed to load product. Please try again.")
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!selectedColor) {
      setError("Please select a color")
      return
    }

    try {
      dispatch({ type: "SET_LOADING" })

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        color: selectedColor,
        quantity,
        image: product.image,
      }

      const updatedCart = await cartService.addToCart(cartItem)
      dispatch({ type: "ADD_TO_CART_SUCCESS", payload: updatedCart })
    } catch (err) {
      setError("Failed to add item to cart. Please try again.")
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!product) {
    return <div className="not-found">Product not found</div>
  }

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">
        <FaArrowLeft className="back-icon" />
        Back to Products
      </Link>

      <div className="product-detail-grid">
        <div className="product-images">
          <div className="main-image-container">
            <img src={product.images?.[selectedImage] || product.image} alt={product.name} className="main-image" />
          </div>
          <div className="thumbnail-grid">
            {product.images?.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image || "/placeholder.svg"} alt={`${product.name} view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(product.rating) ? "star filled" : "star"} />
              ))}
            </div>
            <span className="rating-text">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="product-price">KSh {product.price}</div>

          {product.inStock ? (
            <div className="in-stock">
              <FaCheck className="check-icon" />
              <span>In Stock</span>
            </div>
          ) : (
            <div className="out-of-stock">Out of Stock</div>
          )}

          <div className="product-colors">
            <h3>Frame Color</h3>
            <div className="color-options">
              {product.colors?.map((color) => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? "selected" : ""}`}
                  onClick={() => setSelectedColor(color)}
                >
                  <input
                    type="radio"
                    id={color}
                    name="color"
                    value={color}
                    checked={selectedColor === color}
                    onChange={() => setSelectedColor(color)}
                  />
                  <label htmlFor={color}>{color}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button className="quantity-btn" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="quantity-input"
              />
              <button className="quantity-btn" onClick={() => setQuantity((prev) => prev + 1)}>
                +
              </button>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!product.inStock}>
              <FaShoppingCart className="cart-icon" />
              Add to Cart
            </button>

            <button className="wishlist-btn">
              <FaHeart className="heart-icon" />
            </button>
          </div>

          <div className="product-tabs">
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`tab-btn ${activeTab === "features" ? "active" : ""}`}
                onClick={() => setActiveTab("features")}
              >
                Features
              </button>
              <button
                className={`tab-btn ${activeTab === "shipping" ? "active" : ""}`}
                onClick={() => setActiveTab("shipping")}
              >
                Shipping
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "description" && <p>{product.description}</p>}

              {activeTab === "features" && (
                <ul className="features-list">
                  {product.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}

              {activeTab === "shipping" && (
                <p>
                  Free shipping on all orders over $50. Standard delivery takes 3-5 business days. Express shipping
                  options are available at checkout for an additional fee. International shipping is available to select
                  countries.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="related-products">
        <h2>You May Also Like</h2>
        <div className="related-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="related-card">
              <div className="related-image">
                <img src="/placeholder.svg?height=300&width=300" alt="Related product" />
              </div>
              <div className="related-details">
                <h3>Similar Style Frame</h3>
                <div className="related-price">KSh 119.99</div>
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
