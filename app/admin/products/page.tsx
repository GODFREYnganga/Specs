"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import useSWR from "swr"

interface Product {
  _id: string
  sku: string
  name: string
  price: number
  category: string
  inStock: boolean
  stock: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminProducts() {
  const { data: products = [], error, isLoading, mutate } = useSWR(
    "/api/products",
    fetcher,
    { refreshInterval: 3000 }
  )

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      })
      mutate() // Revalidate after delete
    } catch (err) {
      alert("Failed to delete product")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="text-gray-600 dark:text-gray-300 text-sm mr-4">
          Total: {products.length}
        </div>
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">
          {error.message || "Failed to load products"}
        </div>
      ) : (
        <div className="overflow-x-auto" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">In Stock</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product._id} className="border-b">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2">KSh {product.price}</td>
                  <td className="p-2">{product.sku}</td>
                  <td className="p-2">
                    <span
                      className={
                        product.stock > 10
                          ? "text-green-600 font-semibold"
                          : product.stock > 0
                          ? "text-yellow-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {typeof product.stock === 'number' ? product.stock : '-'}
                    </span>
                  </td>
                  <td className="p-2">{product.inStock ? "Yes" : "No"}</td>
                  <td className="p-2">
                    <Link href={`/admin/products/${product._id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
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
