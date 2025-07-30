"use client"

import { useEffect, useState } from 'react'
import { useCart } from '@/hooks/use-modern-cart'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CartTestPage() {
  const { items, addItem, loading, totals } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[Cart Test] ${message}`)
  }

  useEffect(() => {
    addLog(`User authenticated: ${isAuthenticated}`)
    addLog(`User ID: ${user?.id || 'guest'}`)
    addLog(`Cart items: ${items.length}`)
    addLog(`Cart loading: ${loading}`)
  }, [isAuthenticated, user, items, loading])

  const testAddToCart = async () => {
    addLog('Testing add to cart...')
    try {
      await addItem({
        productId: 'test-123',
        name: 'Test Product',
        price: 2999,
        quantity: 1,
        color: 'Black',
        image: '/placeholder.svg',
        category: 'sunglasses',
        inStock: true
      })
      addLog('✅ Successfully added item to cart')
    } catch (error) {
      addLog(`❌ Failed to add item: ${error}`)
    }
  }

  const checkLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('modern_cart')
      addLog(`LocalStorage cart: ${stored || 'empty'}`)
      
      const token = localStorage.getItem('token')
      addLog(`Token exists: ${!!token}`)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Cart Functionality Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Current State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>User:</strong> {isAuthenticated ? user?.email : 'Guest'}
            </div>
            <div>
              <strong>Cart Items:</strong> {items.length}
            </div>
            <div>
              <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Subtotal:</strong> KSh {(totals.subtotal / 100).toFixed(2)}
            </div>
            
            <div className="space-y-2">
              <Button onClick={testAddToCart} disabled={loading}>
                Test Add to Cart
              </Button>
              <Button onClick={checkLocalStorage} variant="outline">
                Check LocalStorage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cart Items</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-gray-500">No items in cart</p>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="p-2 border rounded">
                    <div><strong>{item.name}</strong></div>
                    <div>Color: {item.color}</div>
                    <div>Quantity: {item.quantity}</div>
                    <div>Price: KSh {(item.price / 100).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Debug Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto bg-gray-100 p-4 rounded text-sm font-mono">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
