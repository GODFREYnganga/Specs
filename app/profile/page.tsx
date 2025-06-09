"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true)
      const resUser = await fetch("/api/users/me")
      const resOrders = await fetch("/api/orders?mine=true")
      if (resUser.ok) setUser(await resUser.json())
      if (resOrders.ok) setOrders(await resOrders.json())
      setLoading(false)
    }
    fetchProfile()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return <div className="p-8">Not logged in.</div>

  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <div className="font-semibold text-lg">{user.firstName} {user.lastName}</div>
              <div className="text-muted-foreground">{user.email}</div>
            </div>
            <Button className="ml-auto" onClick={() => router.push("/orders")}>View All Orders</Button>
          </div>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-semibold mb-4">Order History</h2>
      <Card>
        <CardContent className="p-4">
          {orders.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>KSh {order.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
