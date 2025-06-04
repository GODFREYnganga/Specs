"use client"

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Minus, Plus, Trash2 } from "lucide-react"
import { StateContext } from "../context/StateContext"
import { getCart, updateCartItem, removeFromCart } from "../services/cartService"
import "./Cart.css"

function CartPage() {
  const { state, dispatch } = useContext(StateContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart()
        dispatch({
          type: "SET_CART",
          payload: response.data,
        })
        setLoading(false)
      } catch (err) {
        setError("Failed to load cart. Please try again.")
        setLoading(false)
      }
    }

    fetchCart()
  }, [dispatch])

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return

    try {
      const response = await updateCartItem(item.id, item.color, newQuantity)
      dispatch({
        type: "UPDATE_CART",
        payload: response.data,
      })
    } catch (err) {
      setError("Failed to update item. Please try again.")
    }
  }

  const handleRemoveItem = async (item) => {
    try {
      const response = await removeFromCart(item.id, item.color)
      dispatch({
        type: "UPDATE_CART",
        payload: response.data,
      })
    } catch (err) {
      setError("Failed to remove item. Please try again.")
    }
  }

  if (loading) {
    return <div className="container px-4 md:px-6 py-8">Loading cart...</div>
  }

  const { items = [], subtotal = 0, shipping = 0, tax = 0, total = 0 } = state.cart || {}

  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {error && <div className="error-message mb-4">{error}</div>}

      {items.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={`${item.id}-${item.color}`}>
                    <td>
                      <div className="product-info">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="product-image"
                        />
                        <div>
                          <div className="product-name">{item.name}</div>
                          <div className="product-color">Color: {item.color}</div>
                        </div>
                      </div>
                    </td>
                    <td>KSh {(item.price / 100).toFixed(2)}</td>
                    <td>
                      <div className="quantity-control">
                        <button className="quantity-btn" onClick={() => handleQuantityChange(item, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                          className="quantity-input"
                        />
                        <button className="quantity-btn" onClick={() => handleQuantityChange(item, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td>KSh {((item.price * item.quantity) / 100).toFixed(2)}</td>
                    <td>
                      <button className="remove-btn" onClick={() => handleRemoveItem(item)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-actions">
              <Link to="/products" className="btn-secondary">
                Continue Shopping
              </Link>
              <button className="btn-secondary">Update Cart</button>
            </div>
          </div>

          <div>
            <div className="order-summary">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>KSh {(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>KSh {(tax / 100).toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Total</span>
                  <span>KSh {(total / 100).toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary checkout-btn">
                Proceed to Checkout
              </Link>

              <div className="promo-section">
                <h3 className="promo-title">Promo Code</h3>
                <div className="promo-form">
                  <input placeholder="Enter code" className="promo-input" />
                  <button className="btn-secondary">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <h2 className="empty-title">Your cart is empty</h2>
          <p className="empty-message">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  )
}

export default CartPage
