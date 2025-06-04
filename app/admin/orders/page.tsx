"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Order {
  _id: string
  user: string
  total: number
  status: string
  createdAt: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 text-left">Order ID</th>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-2">{order._id}</td>
                  <td className="p-2">{order.user}</td>
                  <td className="p-2">KSh {order.total}</td>
                  <td className="p-2">{order.status}</td>
                  <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
