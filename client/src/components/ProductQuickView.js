"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./ProductQuickView.css"

const ProductQuickView = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    onAddToCart({
      ...product,
      selectedSize,
      quantity,
    })

    onClose()
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="quick-view-overlay" onClick={onClose}>
      <div className="quick-view-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="quick-view-content">
          <div className="quick-view-image">
            <img src={product.image || "/placeholder.svg"} alt={product.name} />
          </div>

          <div className="quick-view-details">
            <h2>{product.name}</h2>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="description">{product.description}</p>

            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="size-options">
                {["Small", "Medium", "Large", "Extra Large"].map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? "selected" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-selector">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button onClick={decrementQuantity}>-</button>
                <span>{quantity}</span>
                <button onClick={incrementQuantity}>+</button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <Link to={`/products/${product._id}`} className="view-details-button">
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductQuickView
