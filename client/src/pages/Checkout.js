"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, CreditCard } from "lucide-react"
import { StateContext } from "../context/StateContext"
import { getCart } from "../services/cartService"
import { createOrder } from "../services/orderService"
import "./Checkout.css"

function CheckoutPage() {
  const [step, setStep] = useState("shipping")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })

  const { state, dispatch } = useContext(StateContext)
  const navigate = useNavigate()

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        items: state.cart.items,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          email: formData.email,
          phone: formData.phone,
        },
        paymentMethod: {
          type: "credit-card",
          cardName: formData.cardName,
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          expiry: formData.expiry,
          cvc: formData.cvc,
        },
      }

      const response = await createOrder(orderData)

      dispatch({
        type: "CLEAR_CART",
      })

      navigate("/order-confirmation", { state: { order: response.data } })
    } catch (err) {
      setError("Failed to place order. Please try again.")
      setLoading(false)
    }
  }

  if (loading && !state.cart) {
    return <div className="container px-4 md:px-6 py-8">Loading checkout...</div>
  }

  const { items = [], subtotal = 0, shipping = 0, tax = 0, total = 0 } = state.cart || {}

  return (
    <div className="container px-4 md:px-6 py-8">
      <Link to="/cart" className="back-link">
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="page-title">Checkout</h1>

      {error && <div className="error-message mb-4">{error}</div>}

      <div className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-tabs">
            <div className="tabs-list">
              <button
                className={`tab-trigger ${step === "shipping" ? "active" : ""}`}
                onClick={() => setStep("shipping")}
              >
                Shipping
              </button>
              <button
                className={`tab-trigger ${step === "payment" ? "active" : ""}`}
                onClick={() => setStep("payment")}
              >
                Payment
              </button>
              <button className={`tab-trigger ${step === "review" ? "active" : ""}`} onClick={() => setStep("review")}>
                Review
              </button>
            </div>

            <div className="tab-content">
              {step === "shipping" && (
                <div className="shipping-step">
                  <div className="form-section">
                    <h2 className="section-title">Contact Information</h2>
                    <div className="form-fields">
                      <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="phone">Phone</label>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="(123) 456-7890"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-divider"></div>

                  <div className="form-section">
                    <h2 className="section-title">Shipping Address</h2>
                    <div className="form-fields">
                      <div className="form-row">
                        <div className="form-field">
                          <label htmlFor="firstName">First name</label>
                          <input id="firstName" value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div className="form-field">
                          <label htmlFor="lastName">Last name</label>
                          <input id="lastName" value={formData.lastName} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="form-field">
                        <label htmlFor="address">Address</label>
                        <input id="address" value={formData.address} onChange={handleChange} />
                      </div>
                      <div className="form-field">
                        <label htmlFor="apartment">Apartment, suite, etc. (optional)</label>
                        <input id="apartment" value={formData.apartment} onChange={handleChange} />
                      </div>
                      <div className="form-row three-columns">
                        <div className="form-field">
                          <label htmlFor="city">City</label>
                          <input id="city" value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="form-field">
                          <label htmlFor="state">State</label>
                          <input id="state" value={formData.state} onChange={handleChange} />
                        </div>
                        <div className="form-field">
                          <label htmlFor="zip">ZIP code</label>
                          <input id="zip" value={formData.zip} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" onClick={() => setStep("payment")}>
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div className="payment-step">
                  <div className="form-section">
                    <h2 className="section-title">Payment Method</h2>
                    <div className="payment-methods">
                      <div className="payment-method">
                        <input type="radio" id="credit-card" name="payment-method" value="credit-card" defaultChecked />
                        <label htmlFor="credit-card" className="payment-label">
                          <CreditCard className="h-4 w-4" />
                          Credit Card
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-fields">
                    <div className="form-field">
                      <label htmlFor="cardName">Name on card</label>
                      <input id="cardName" placeholder="John Doe" value={formData.cardName} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="cardNumber">Card number</label>
                      <input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="expiry">Expiry date</label>
                        <input id="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleChange} />
                      </div>
                      <div className="form-field">
                        <label htmlFor="cvc">CVC</label>
                        <input id="cvc" placeholder="123" value={formData.cvc} onChange={handleChange} />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => setStep("shipping")}>
                      Back to Shipping
                    </button>
                    <button className="btn-primary" onClick={() => setStep("review")}>
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {step === "review" && (
                <div className="review-step">
                  <div className="form-section">
                    <h2 className="section-title">Review Your Order</h2>
                    <div className="review-sections">
                      <div className="review-section">
                        <h3 className="review-subtitle">Shipping Address</h3>
                        <p className="review-text">
                          {formData.firstName} {formData.lastName}
                          <br />
                          {formData.address}
                          {formData.apartment && (
                            <>
                              <br />
                              {formData.apartment}
                            </>
                          )}
                          <br />
                          {formData.city}, {formData.state} {formData.zip}
                        </p>
                        <button className="btn-link" onClick={() => setStep("shipping")}>
                          Edit
                        </button>
                      </div>

                      <div className="review-section">
                        <h3 className="review-subtitle">Payment Method</h3>
                        <p className="review-text">Credit Card ending in {formData.cardNumber.slice(-4)}</p>
                        <button className="btn-link" onClick={() => setStep("payment")}>
                          Edit
                        </button>
                      </div>

                      <div className="review-section">
                        <h3 className="review-subtitle">Items</h3>
                        <ul className="review-items">
                          {items.map((item) => (
                            <li key={`${item.id}-${item.color}`} className="review-item">
                              <div className="item-info">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={40}
                                  height={40}
                                  className="item-image"
                                />
                                <div>
                                  <div className="item-name">{item.name}</div>
                                  <div className="item-color">Color: {item.color}</div>
                                </div>
                              </div>
                              <div className="item-price">KSh {((item.price * item.quantity) / 100).toFixed(2)}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => setStep("payment")}>
                      Back to Payment
                    </button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                      {loading ? "Processing..." : "Place Order"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-items">
              {items.map((item) => (
                <div key={`${item.id}-${item.color}`} className="summary-item">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>KSh {((item.price * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>KSh {(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `KSh ${(shipping / 100).toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>KSh {(tax / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>KSh {(total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
