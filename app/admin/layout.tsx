import React from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <nav className="flex gap-4 mb-8">
          <Link href="/admin" className="font-medium hover:underline">Overview</Link>
          <Link href="/admin/products" className="font-medium hover:underline">Products</Link>
          <Link href="/admin/users" className="font-medium hover:underline">Users</Link>
          <Link href="/admin/orders" className="font-medium hover:underline">Orders</Link>
        </nav>
        <Card className="p-6 shadow-md bg-white dark:bg-gray-900">
          {children}
        </Card>
      </div>
    </div>
  )
}
