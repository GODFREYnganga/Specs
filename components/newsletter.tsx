"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"

/**
 * Newsletter Component
 *
 * Displays a newsletter subscription form with success message feedback.
 * Features a clean design with form validation and state management.
 */
export function Newsletter() {
  // State to track the email input value
  const [email, setEmail] = useState("")

  // State to track whether the user has successfully subscribed
  const [subscribed, setSubscribed] = useState(false)

  /**
   * Handler for form submission
   * Validates email and shows success message
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Only proceed if email is provided
    if (email) {
      // Here you would normally submit to your newsletter service
      // For demo purposes, we just show a success message
      setSubscribed(true)
      setEmail("")

      // Reset the subscribed message after 5 seconds
      setTimeout(() => {
        setSubscribed(false)
      }, 5000)
    }
  }

  return (
    <section className="py-12 bg-[#FF6600] border-t">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center text-bue-950">
          {/* Section header */}
          <h2 className="text-4xl font-extrabold mb-3">Join Our Style Community</h2>
          <p className="text-white text-xl mb-8">
            Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and eyewear
            trends.
          </p>

          {/* Subscription form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800 placeholder-gray-500"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 	bg-blue-950 text-white font-medium rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              Subscribe
              <Send size={16} className="ml-2" />
            </button>
          </form>

          {/* Success message (conditionally rendered) */}
          {subscribed && (
            <div className="mt-4 text-[#B5C99A] animate-fadeIn">
              Thanks for subscribing! Check your email for confirmation.
            </div>
          )}

          {/* Privacy notice */}
          <p className="mt-6 text-sm text-white text-lg">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  )
}
