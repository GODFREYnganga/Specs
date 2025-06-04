"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: number
  category: string
  inStock: boolean
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">In Stock</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2">KSh {product.price}</td>
                  <td className="p-2">{product.inStock ? "Yes" : "No"}</td>
                  <td className="p-2">
                    <Link href={`/admin/products/${product._id}`}><Button variant="outline" size="sm">Edit</Button></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
