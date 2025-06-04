"use client"

import { ShoppingCart, Heart, X } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
}

interface ProductQuickViewProps {
  product: Product
  onClose: () => void
}

export function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-medium text-gray-900">Quick View</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 flex items-center justify-center">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="max-h-[50vh] object-cover rounded-md"
            />
          </div>

          <div className="p-6">
            <span className="text-sm font-medium text-gray-500">{product.category}</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1 mb-4">{product.name}</h2>
            <p className="text-xl font-bold text-gray-900 mb-6">KSh {product.price}</p>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">
                Premium quality frames designed for comfort and style. Made with high-quality materials that are built
                to last. Includes anti-scratch coating and UV protection.
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Frame Color</h4>
              <div className="flex space-x-2">
                <button className="w-8 h-8 rounded-full bg-black border-2 border-white outline outline-1 outline-black"></button>
                <button className="w-8 h-8 rounded-full bg-amber-800 border-2 border-white"></button>
                <button className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="px-8 py-3 flex items-center justify-center gap-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition flex-1">
                <ShoppingCart size={16} />
                Add to Cart
              </button>
              <button className="px-8 py-3 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition">
                <Heart size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
