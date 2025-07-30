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
    try {      await fetch("/api/products", {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-2 sm:mb-3 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Product Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Manage your eyewear products inventory</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900 px-3 py-2 rounded-lg w-full sm:w-auto">
                <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">Total: {products.length}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Link href="/admin/products/new" className="w-full sm:w-auto">
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="sm:hidden">Add Product</span>
                    <span className="hidden sm:inline">Add Product</span>
                  </Button>
                </Link>
                <Link href="/admin/products/bulk-upload" className="w-full sm:w-auto">
                  <Button variant="outline" className="border-2 w-full sm:w-auto text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="sm:hidden">Bulk Upload</span>
                    <span className="hidden sm:inline">Bulk Upload (Excel)</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>        {/* Products Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Loading products...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center px-4">
                <div className="text-red-500 text-xl mb-2">⚠️</div>
                <div className="text-red-500 font-medium text-sm sm:text-base">
                  {error.message || "Failed to load products"}
                </div>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center px-4">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📦</div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">Get started by adding your first product</p>
                <Link href="/admin/products/new">
                  <Button className="text-sm">Add Your First Product</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Stock Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Availability
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product: any) => (
                      <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">
                              SKU: {product.sku || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {product.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                          KSh {product.price?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              (product.stock || 0) > 10
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : (product.stock || 0) > 0
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}>
                              {typeof product.stock === 'number' ? product.stock : '0'} in stock
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.inStock 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}>
                            {product.inStock ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/admin/products/${product._id}`}>
                              <Button variant="outline" size="sm" className="hover:bg-blue-50">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="hover:bg-red-600"
                              onClick={() => handleDelete(product._id)}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Shown on small screens */}
              <div className="lg:hidden p-4 space-y-4">
                {products.map((product: any) => (
                  <Card key={product._id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* Product Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                            SKU: {product.sku || 'N/A'}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <Link href={`/admin/products/${product._id}`}>
                            <Button variant="outline" size="sm" className="p-2">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="p-2"
                            onClick={() => handleDelete(product._id)}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>

                      {/* Product Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Category:</span>
                          <div className="mt-1">
                            <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {product.category || 'Uncategorized'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Price:</span>
                          <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                            KSh {product.price?.toLocaleString() || '0'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Stock:</span>
                          <div className="mt-1">
                            <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                              (product.stock || 0) > 10
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : (product.stock || 0) > 0
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}>
                              {typeof product.stock === 'number' ? product.stock : '0'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Status:</span>
                          <div className="mt-1">
                            <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                              product.inStock 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}>
                              {product.inStock ? "Available" : "Unavailable"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
