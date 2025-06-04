import React from "react"
import { Card } from "@/components/ui/card"

export default function AdminHome() {
  // Placeholder for stats, can be replaced with real data
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 text-center">
        <div className="text-2xl font-bold">Products</div>
        <div className="text-4xl mt-2">-</div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-2xl font-bold">Users</div>
        <div className="text-4xl mt-2">-</div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-2xl font-bold">Orders</div>
        <div className="text-4xl mt-2">-</div>
      </Card>
    </div>
  )
}
