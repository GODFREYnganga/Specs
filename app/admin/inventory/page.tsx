"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { 
  Loader2, 
  Search, 
  AlertTriangle, 
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Minus,
  Bell,
  Truck,
  Factory,
  Eye,  Calendar,
  BarChart3,
  Clock
} from "lucide-react"

interface Product {
  _id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  lowStockThreshold: number
  supplier?: string
  lastRestock: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

interface StockMovement {
  _id: string
  productId: string
  productName: string
  type: 'restock' | 'sale' | 'adjustment' | 'return'
  quantity: number
  previousStock: number
  newStock: number
  reason?: string
  date: string
  user: string
}

interface Supplier {
  _id: string
  name: string
  email: string
  phone: string
  products: string[]
  status: 'active' | 'inactive'
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0)
  const [adjustmentReason, setAdjustmentReason] = useState("")
  const [showAddSupplier, setShowAddSupplier] = useState(false)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    recentMovements: 0
  })

  const loadInventoryData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      
      const [productsRes, movementsRes, suppliersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/inventory/movements"),
        fetch("/api/inventory/suppliers")
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        // Add stock status to products
        const enrichedProducts = productsData.map((product: any) => ({
          ...product,
          lowStockThreshold: product.lowStockThreshold || 10,
          status: product.stock === 0 ? 'out-of-stock' : 
                 product.stock <= (product.lowStockThreshold || 10) ? 'low-stock' : 'in-stock'
        }))
        setProducts(enrichedProducts)
        calculateStats(enrichedProducts)
      }

      if (movementsRes.ok) {
        const movementsData = await movementsRes.json()
        setStockMovements(movementsData)
      }      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json()
        setSuppliers(suppliersData)
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Load inventory error:", error)
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive"
      })
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  const calculateStats = (productsData: Product[]) => {
    const totalValue = productsData.reduce((sum, p) => sum + (p.price * p.stock), 0)
    const today = new Date().toDateString()
    const recentMovements = stockMovements.filter(m => 
      new Date(m.date).toDateString() === today
    ).length

    setStats({
      totalProducts: productsData.length,
      lowStockItems: productsData.filter(p => p.status === 'low-stock').length,
      outOfStockItems: productsData.filter(p => p.status === 'out-of-stock').length,
      totalValue,
      recentMovements
    })
  }

  useEffect(() => {
    loadInventoryData()
  }, [loadInventoryData])

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (autoRefresh) {
      interval = setInterval(() => {
        loadInventoryData(false)
      }, 30000) // Every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, loadInventoryData])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, stockFilter])

  function filterProducts() {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (stockFilter !== "all") {
      filtered = filtered.filter(product => product.status === stockFilter)
    }

    setFilteredProducts(filtered)
  }

  async function adjustStock(productId: string, adjustment: number, reason: string) {
    try {      const response = await fetch("/api/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          adjustment,
          reason
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Stock adjusted successfully"
        })
        loadInventoryData(false)
        setSelectedProduct(null)
        setAdjustmentQuantity(0)
        setAdjustmentReason("")
      } else {
        throw new Error("Failed to adjust stock")
      }    } catch (error) {
      console.error("Adjust stock error:", error)
      toast({
        title: "Error",
        description: "Failed to adjust stock",
        variant: "destructive"
      })
    }
  }

  async function addSupplier() {
    try {
      const response = await fetch("/api/inventory/suppliers", {        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Supplier added successfully"
        })
        loadInventoryData(false)
        setShowAddSupplier(false)
        setNewSupplier({ name: "", email: "", phone: "" })      } else {
        throw new Error("Failed to add supplier")
      }
    } catch (error) {
      console.error("Add supplier error:", error)
      toast({
        title: "Error",
        description: "Failed to add supplier",
        variant: "destructive"
      })
    }
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800'
      case 'low-stock': return 'bg-yellow-100 text-yellow-800'
      case 'out-of-stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'restock': return <Plus className="h-4 w-4 text-green-600" />
      case 'sale': return <Minus className="h-4 w-4 text-blue-600" />
      case 'adjustment': return <BarChart3 className="h-4 w-4 text-orange-600" />
      case 'return': return <RefreshCw className="h-4 w-4 text-purple-600" />
      default: return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage product inventory</p>
        </div>
          <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
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
          
          <Button variant="outline" size="sm" onClick={() => loadInventoryData()}>
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
                <span className="text-sm font-medium">Real-time inventory tracking</span>
              </div>
              <div className="text-sm text-gray-600">
                <Package className="h-4 w-4 inline mr-1" />
                {stats.totalProducts} total products
              </div>
              <div className="text-sm text-gray-600">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                {stats.lowStockItems + stats.outOfStockItems} need attention
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
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
              </div>
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold">KSh {stats.totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Movements</p>
                <p className="text-2xl font-bold">{stats.recentMovements}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(stats.lowStockItems > 0 || stats.outOfStockItems > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Bell className="h-5 w-5" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.outOfStockItems > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">{stats.outOfStockItems} products are out of stock</span>
                </div>
              )}
              {stats.lowStockItems > 0 && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">{stats.lowStockItems} products are running low on stock</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Levels</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={showAddSupplier} onOpenChange={setShowAddSupplier}>
          <DialogTrigger asChild>
            <Button>
              <Factory className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="supplierEmail">Email</Label>
                <Input
                  id="supplierEmail"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="supplierPhone">Phone</Label>
                <Input
                  id="supplierPhone"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <Button onClick={addSupplier} className="w-full">
                Add Supplier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{product.stock}</span>
                        <span className="text-sm text-gray-500">
                          (Min: {product.lowStockThreshold})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStockStatusColor(product.status)}>
                        {product.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      KSh {(product.price * product.stock).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {product.supplier || 'Not assigned'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Adjust
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adjust Stock - {selectedProduct?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Current Stock: {selectedProduct?.stock}</Label>
                              </div>
                              <div>
                                <Label htmlFor="adjustment">Adjustment (+/-)</Label>
                                <Input
                                  id="adjustment"
                                  type="number"
                                  value={adjustmentQuantity}
                                  onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                                  placeholder="Enter quantity (positive to add, negative to remove)"
                                />
                              </div>
                              <div>
                                <Label htmlFor="reason">Reason</Label>
                                <Input
                                  id="reason"
                                  value={adjustmentReason}
                                  onChange={(e) => setAdjustmentReason(e.target.value)}
                                  placeholder="Reason for adjustment"
                                />
                              </div>
                              <div>
                                <Label>New Stock: {(selectedProduct?.stock || 0) + adjustmentQuantity}</Label>
                              </div>
                              <Button 
                                onClick={() => adjustStock(selectedProduct?._id || '', adjustmentQuantity, adjustmentReason)}
                                className="w-full"
                                disabled={!adjustmentQuantity || !adjustmentReason}
                              >
                                Apply Adjustment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Link href={`/admin/products/${product._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Stock Movements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Recent Stock Movements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stockMovements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent stock movements</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Previous</TableHead>
                  <TableHead>New</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockMovements.slice(0, 10).map((movement) => (
                  <TableRow key={movement._id}>
                    <TableCell className="font-medium">{movement.productName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMovementIcon(movement.type)}
                        {movement.type.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </TableCell>
                    <TableCell>{movement.previousStock}</TableCell>
                    <TableCell className="font-bold">{movement.newStock}</TableCell>
                    <TableCell>{movement.reason || '-'}</TableCell>
                    <TableCell>{new Date(movement.date).toLocaleDateString()}</TableCell>
                    <TableCell>{movement.user}</TableCell>
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
