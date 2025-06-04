"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapPin, Mail, Phone } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  })
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [subscribeEmail, setSubscribeEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    // Show the subscription popup after 3 seconds
    const timer = setTimeout(() => {
      setShowSubscribe(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      message: "",
    })
    // Show success message or redirect
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Subscribed with email:", subscribeEmail)
    setSubscribed(true)
    setTimeout(() => {
      setShowSubscribe(false)
    }, 3000)
  }

  return (
    <div className="pt-[160px]">
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Info</h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                  <p className="text-gray-600">
                    Shop 5, next to Prime bank, doctors park,
                    <br />
                    3rd parklands, nairobi kenya
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-gray-600" />
                  <a href="tel:+254712345678" className="text-gray-600 hover:text-gray-900">
                    +254 712 345 678
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-gray-600" />
                  <a href="mailto:support@lens2cart.com" className="text-gray-600 hover:text-gray-900">
                    support@lens2cart.com
                  </a>
                </div>
              </div>

              {/* Google Maps */}
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

      {/* Subscription Popup */}
      {showSubscribe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full relative animate-fadeIn">
            <button
              onClick={() => setShowSubscribe(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter to receive updates on new products, special offers, and eyecare tips.
            </p>
            {subscribed ? (
              <div className="text-green-600 font-medium">Thank you for subscribing!</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
