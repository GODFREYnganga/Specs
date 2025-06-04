"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Mail } from "lucide-react"

/**
 * ContactSection Component
 *
 * Displays a contact form alongside business location information.
 * Features form validation and state management for user inputs.
 */
export function ContactSection() {
  // State to track form input values
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  })

  /**
   * Handler for form submission
   * In a real application, this would send the data to a server
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a production environment, this would submit the form data to an API
    console.log("Form submitted:", formData)

    // Here you would typically:
    // 1. Validate the data
    // 2. Send it to your backend
    // 3. Show a success message
    // 4. Reset the form
  }

  /**
   * Handler for input changes
   * Updates the form data state as the user types
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column with contact form */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Message field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                ></textarea>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right column with contact information and map */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Info</h2>
            <div className="space-y-6 mb-8">
              {/* Address information */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                <p className="text-gray-600">
                  Shop 5, next to Prime bank, doctors park,
                  <br />
                  3rd parklands, nairobi kenya
                </p>
              </div>

              {/* Email information */}
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-gray-600" />
                <a href="mailto:support@lens2cart.com" className="text-gray-600 hover:text-gray-900">
                  support@lens2cart.com
                </a>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="h-[400px] rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8169607426377!2d36.8164697!3d-1.2627675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17f2804f4721%3A0x51e27e08afb8c9d3!2sPRQC%2BFJ5%2C%20Nairobi%2C%20Kenya!5e0!3m2!1sen!2s!4v1647887642345!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
