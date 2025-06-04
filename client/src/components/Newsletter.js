"use client"

import { useState } from "react"
import "./Newsletter.css"

function Newsletter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    // In a real app, you would send this to your backend
    console.log("Newsletter subscription:", email)

    // Show success message
    setSubscribed(true)
    setError("")
    setEmail("")

    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubscribed(false)
    }, 5000)
  }

  return (
    <section className="newsletter-section bg-gray-100 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-8">
            Stay updated with our latest collections, exclusive offers, and eyecare tips.
          </p>

          {subscribed ? (
            <div className="success-message p-4 bg-green-100 text-green-700 rounded-md">
              Thank you for subscribing! You'll receive our next newsletter soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
                {error && <p className="error-message mt-2 text-red-600 text-sm">{error}</p>}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          )}

          <p className="text-sm text-gray-500 mt-4">We respect your privacy and will never share your information.</p>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
