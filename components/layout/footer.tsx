"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  const [settings, setSettings] = useState<any>(null)
  // Helper to fetch settings
  const fetchSettings = () => {
    fetch('/api/settings')
      .then((res: Response) => res.json())
      .then((data: any) => setSettings(data))
      .catch(() => setSettings(null))
  }
  useEffect(() => {
    fetchSettings()
    // Listen for logo update events (localStorage)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'storeLogoUpdated') fetchSettings()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  return (
    <footer className="bg-[#002147] text-white">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src={settings?.general?.storeLogo || "/images/logo/lens2cart-logo.png"}
                alt="Lens2Cart Logo"
                width={200}
                height={67}
                className="h-auto bg-white p-2 rounded"
              />
            </div>
            <p className="text-yellow-400 mb-4">
              Premium eyewear for those who appreciate quality, style, and perfect vision.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-[#FFD700] mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=eyeglasses"
                  className="text-gray-300 hover:text-[#B5C99A] transition-colors"
                >
                  Eyeglasses
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=sunglasses"
                  className="text-gray-300 hover:text-[#B5C99A] transition-colors"
                >
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=collections"
                  className="text-gray-300 hover:text-[#B5C99A] transition-colors"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=new-arrivals"
                  className="text-gray-300 hover:text-[#B5C99A] transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?category=sale" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[#FFD700] mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Frame Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Prescription Help
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[#FFD700] mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  Materials & Quality
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#444444] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-yellow-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Lens2Cart. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-yellow-400 hover:text-[#B5C99A] text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-yellow-400 hover:text-[#B5C99A] text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-yellow-400 hover:text-[#B5C99A] text-sm transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
