import Link from "next/link"
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 py-8 pt-[160px]">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="md:w-1/3">
          <Link href="/" className="flex items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Lens2Cart</h1>
          </Link>
          <div className="contact-info space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-600" />
              <span>+254 712 345 678</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-600" />
              <span>support@lens2cart.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span>Shop 5, next to Prime bank, doctors park, 3rd parklands, Nairobi Kenya</span>
            </div>
            <div className="flex space-x-4 mt-4">
              <Link href="https://facebook.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Facebook size={24} />
              </Link>
              <Link href="https://instagram.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Instagram size={24} />
              </Link>
              <Link href="https://twitter.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Twitter size={24} />
              </Link>
              <Link href="https://wa.me/254712345678" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-6">About Lens2Cart</h1>
          <div className="prose max-w-none">
            <p>
              Lens2Cart is a premier eyewear retailer dedicated to providing high-quality glasses, sunglasses, and
              contact lenses to our customers. Founded in 2015, we have grown to become one of the most trusted names in
              the optical industry in Kenya.
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
            <p>
              Our mission is to enhance the vision and style of our customers by offering premium eyewear products at
              affordable prices. We believe that everyone deserves to see clearly and look their best.
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Our Vision</h2>
            <p>
              To be the leading eyewear provider in East Africa, known for our exceptional customer service, innovative
              products, and commitment to eye health.
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Wide selection of premium eyewear from top brands</li>
              <li>Expert opticians to help you find the perfect fit</li>
              <li>Competitive pricing and regular promotions</li>
              <li>Comprehensive eye examinations</li>
              <li>Fast and reliable delivery across Kenya</li>
              <li>Excellent customer service and after-sales support</li>
            </ul>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Our Team</h2>
            <p>
              Our team consists of experienced opticians, fashion consultants, and customer service representatives who
              are passionate about helping you find the perfect eyewear solution. We continuously train our staff to
              stay updated with the latest trends and technologies in the optical industry.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
