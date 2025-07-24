"use client"

import { useEffect } from 'react'
import { useCart } from '@/hooks/use-modern-cart'
import { useAuth } from '@/hooks/use-auth'

export default function CartDebugPage() {
  const { items, totals, addItem, loading } = useCart()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    console.log('🔍 Cart Debug - Items:', items)
    console.log('🔍 Cart Debug - Totals:', totals)
    console.log('🔍 Cart Debug - User:', user)
    console.log('🔍 Cart Debug - Is Authenticated:', isAuthenticated)
    console.log('🔍 Cart Debug - Loading:', loading)
  }, [items, totals, user, isAuthenticated, loading])

  const testAddItem = async () => {
    console.log('🧪 Testing add item...')
    try {
      await addItem({
        productId: 'test-123',
        name: 'Test Product',
        price: 2500,
        quantity: 1,
        color: 'Black',
        image: '/placeholder.svg',
        category: 'sunglasses',
        inStock: true
      })
      console.log('✅ Test item added successfully')
    } catch (error) {
      console.error('❌ Test add item failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Cart Debug Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cart Status</h2>
          <div className="space-y-2">
            <p><strong>Items Count:</strong> {items?.length || 0}</p>
            <p><strong>Total Items:</strong> {totals?.itemCount || 0}</p>
            <p><strong>Subtotal:</strong> KSh {((totals?.subtotal || 0) / 100).toFixed(2)}</p>
            <p><strong>User:</strong> {user ? `${user.firstName} ${user.lastName}` : 'Guest'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Add Item</h2>
          <button
            onClick={testAddItem}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Test Item'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
          {items && items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border rounded p-4">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Color: {item.color} | Quantity: {item.quantity} | Price: KSh {(item.price / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items in cart</p>
          )}
        </div>
      </div>
    </div>
  )
}
