import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter } from "lucide-react"
import "./Footer.css"

function Footer() {
  return (
    <footer className="bg-[#333333] text-white">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img
                src="/images/logo/lens2cart-logo.png"
                alt="Lens2Cart Logo"
                className="h-auto w-200 bg-white p-2 rounded"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Premium eyewear for those who appreciate quality, style, and perfect vision.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                <Facebook size={20} />
              </Link>
              <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                <Instagram size={20} />
              </Link>
              <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-[#B5C99A] mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=eyeglasses"
                  className="text-gray-300 hover:text-[#B5C99A] transition-colors"
                >
                  Eyeglasses
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=sunglasses"
                  className="text-gray-300 hover:text-[#B5C99A] transition-colors"
                >
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=collections"
                  className="text-gray-300 hover:text-[#B5C99A] transition-colors"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=new-arrivals"
                  className="text-gray-300 hover:text-[#B5C99A] transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products?category=sale" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[#B5C99A] mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Frame Sizing Guide
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Prescription Help
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-[#B5C99A] mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Materials & Quality
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-300 hover:text-[#B5C99A] transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#444444] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Lens2Cart. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-gray-400 hover:text-[#B5C99A] text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-400 hover:text-[#B5C99A] text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-gray-400 hover:text-[#B5C99A] text-sm transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
