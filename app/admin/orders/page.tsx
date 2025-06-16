"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { 
  Loader2,
  Search, 
  Eye, 
  Trash2, 
  Filter, 
  RefreshCw, 
  Package,
  Clock,
  TrendingUp,
  Users
} from "lucide-react"
import Link from "next/link"

interface Order {
  _id: string;
  user: string | { _id: string; name?: string; email?: string };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800", 
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    todayRevenue: 0
  })

  const loadOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        setLastUpdated(new Date())
        calculateStats(data)
      } else {
        throw new Error("Failed to load orders")
      }    } catch (error) {
      console.error("Load orders error:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      })
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  const calculateStats = (ordersData: Order[]) => {
    const today = new Date().toDateString()
    const todayOrders = ordersData.filter(order => 
      new Date(order.createdAt).toDateString() === today
    )
    
    setStats({
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'pending').length,
      processing: ordersData.filter(o => o.status === 'processing').length,
      shipped: ordersData.filter(o => o.status === 'shipped').length,
      delivered: ordersData.filter(o => o.status === 'delivered').length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0)
    })
  }
  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (autoRefresh) {
      interval = setInterval(() => {
        loadOrders(false) // Refresh without showing loading
      }, 30000) // Every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, loadOrders])
  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  function filterOrders() {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order => {
        const userInfo = typeof order.user === 'object' ? order.user : null
        const userName = userInfo?.name || ""
        const userEmail = userInfo?.email || ""
        
        return (
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.total.toString().includes(searchTerm)
        )
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      setUpdating(orderId)
      const response = await fetch("/api/orders", {
        method: "PUT",        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: orderId, status: newStatus })
      })

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus as any } : order
        ))
        toast({
          title: "Success",
          description: "Order status updated successfully"
        })
      } else {
        throw new Error("Failed to update order status")
      }
    } catch (error) {
      console.error("Update order error:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      })
    } finally {
      setUpdating(null)
    }
  }

  async function deleteOrder(orderId: string) {
    if (!window.confirm("Are you sure you want to delete this order?")) return
    
    try {
      setLoading(true)
      const response = await fetch("/api/orders", {
        method: "DELETE",        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: orderId })
      })

      if (response.ok) {
        setOrders(prev => prev.filter(order => order._id !== orderId))
        toast({
          title: "Success",
          description: "Order deleted successfully"
        })
      } else {
        throw new Error("Failed to delete order")
      }    } catch (error) {
      console.error("Delete order error:", error)
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Orders Management
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage all customer orders</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Not updated'}
          </div>
          
          <Button 
            variant={autoRefresh ? "default" : "outline"} 
            size="sm" 
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => loadOrders()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Real-time monitoring</span>
              </div>
              <div className="text-sm text-gray-600">
                <Package className="h-4 w-4 inline mr-1" />
                {stats.total} total orders
              </div>
              <div className="text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                KSh {stats.todayRevenue.toLocaleString()} today
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-sm">
                      {order._id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      {typeof order.user === 'object' ? (
                        <div>
                          <div className="font-medium">{order.user.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{order.user.email || ''}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Guest User</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items?.length || 0} item(s)
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[order.status]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order._id, value)}
                          disabled={updating === order._id}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/admin/orders/${order._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteOrder(order._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>    </div>
  )
}
