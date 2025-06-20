"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Truck, Package, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Download, Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

interface Shipping {
  _id: string
  orderId: {
    _id: string
    orderNumber?: string
  } | string
  carrier: string
  trackingNumber?: string
  status: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled'
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

interface ShippingStats {
  totalShipments: number
  pendingShipments: number
  inTransitShipments: number
  deliveredShipments: number
  cancelledShipments: number
  deliveryRate: number
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  shipped: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Package },
  in_transit: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck },
  delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
}

const carrierConfig = {
  'DHL': { color: 'bg-yellow-500', icon: '🚛' },
  'FedEx': { color: 'bg-purple-500', icon: '📦' },
  'UPS': { color: 'bg-amber-700', icon: '🚚' },
  'USPS': { color: 'bg-blue-600', icon: '📮' },
  'Kenya Post': { color: 'bg-green-600', icon: '🇰🇪' },
  'Sendy': { color: 'bg-orange-500', icon: '🏍️' },
  'Other': { color: 'bg-gray-500', icon: '📋' }
}

export default function ShippingPage() {
  const [shipments, setShipments] = useState<Shipping[]>([])
  const [stats, setStats] = useState<ShippingStats>({
    totalShipments: 0,
    pendingShipments: 0,
    inTransitShipments: 0,
    deliveredShipments: 0,
    cancelledShipments: 0,
    deliveryRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [carrierFilter, setCarrierFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipping | null>(null)
  const [formData, setFormData] = useState({
    orderId: '',
    carrier: '',
    trackingNumber: '',
    status: 'pending' as Shipping['status'],
    estimatedDelivery: ''
  })

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/shipping')
      if (!response.ok) throw new Error('Failed to fetch shipments')
      const data = await response.json()
      setShipments(data)
      calculateStats(data)
    } catch (error) {
      console.error('Error fetching shipments:', error)
      toast({
        title: "Error",
        description: "Failed to load shipments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (shipmentsData: Shipping[]) => {
    const totalShipments = shipmentsData.length
    const pendingShipments = shipmentsData.filter(s => s.status === 'pending').length
    const inTransitShipments = shipmentsData.filter(s => s.status === 'in_transit').length
    const deliveredShipments = shipmentsData.filter(s => s.status === 'delivered').length
    const cancelledShipments = shipmentsData.filter(s => s.status === 'cancelled').length
    const deliveryRate = totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 100) : 0

    setStats({
      totalShipments,
      pendingShipments,
      inTransitShipments,
      deliveredShipments,
      cancelledShipments,
      deliveryRate
    })
  }

  const handleCreateShipment = async () => {
    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to create shipment')

      toast({
        title: "Success",
        description: "Shipment created successfully",
      })

      setIsCreateDialogOpen(false)
      setFormData({
        orderId: '',
        carrier: '',
        trackingNumber: '',
        status: 'pending',
        estimatedDelivery: ''
      })
      fetchShipments()
    } catch (error) {
      console.error('Error creating shipment:', error)
      toast({
        title: "Error",
        description: "Failed to create shipment",
        variant: "destructive",
      })
    }
  }

  const handleUpdateShipment = async () => {
    if (!selectedShipment) return

    try {
      const response = await fetch('/api/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, _id: selectedShipment._id })
      })

      if (!response.ok) throw new Error('Failed to update shipment')

      toast({
        title: "Success",
        description: "Shipment updated successfully",
      })

      setIsEditDialogOpen(false)
      setSelectedShipment(null)
      fetchShipments()
    } catch (error) {
      console.error('Error updating shipment:', error)
      toast({
        title: "Error",
        description: "Failed to update shipment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return

    try {
      const response = await fetch('/api/shipping', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: shipmentId })
      })

      if (!response.ok) throw new Error('Failed to delete shipment')

      toast({
        title: "Success",
        description: "Shipment deleted successfully",
      })

      fetchShipments()
    } catch (error) {
      console.error('Error deleting shipment:', error)
      toast({
        title: "Error",
        description: "Failed to delete shipment",
        variant: "destructive",
      })
    }
  }

  const handleStatusUpdate = async (shipmentId: string, newStatus: Shipping['status']) => {
    try {
      const shipment = shipments.find(s => s._id === shipmentId)
      if (!shipment) return

      const response = await fetch('/api/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...shipment, _id: shipmentId, status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update status')

      toast({
        title: "Success",
        description: `Shipment status updated to ${newStatus}`,
      })

      fetchShipments()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (shipment: Shipping) => {
    setSelectedShipment(shipment)
    setFormData({
      orderId: typeof shipment.orderId === 'string' ? shipment.orderId : shipment.orderId._id,
      carrier: shipment.carrier,
      trackingNumber: shipment.trackingNumber || '',
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery ? shipment.estimatedDelivery.split('T')[0] : ''
    })
    setIsEditDialogOpen(true)
  }

  const openTrackingDialog = (shipment: Shipping) => {
    setSelectedShipment(shipment)
    setIsTrackingDialogOpen(true)
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      (shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof shipment.orderId === 'object' && shipment.orderId.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    const matchesCarrier = carrierFilter === 'all' || shipment.carrier === carrierFilter

    return matchesSearch && matchesStatus && matchesCarrier
  })

  const exportShipments = () => {
    const csvContent = [
      ['Order ID', 'Carrier', 'Tracking Number', 'Status', 'Estimated Delivery', 'Created At'].join(','),
      ...filteredShipments.map(shipment => [
        typeof shipment.orderId === 'string' ? shipment.orderId : shipment.orderId._id,
        shipment.carrier,
        shipment.trackingNumber || '',
        shipment.status,
        shipment.estimatedDelivery || '',
        new Date(shipment.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shipments.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipping Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage shipments across all carriers
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchShipments} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportShipments} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Shipment
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShipments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingShipments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.inTransitShipments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.deliveredShipments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelledShipments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveryRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by tracking number, carrier, or order..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="carrier-filter">Carrier</Label>
              <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carriers</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="Kenya Post">Kenya Post</SelectItem>
                  <SelectItem value="Sendy">Sendy</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments</CardTitle>
          <CardDescription>
            {filteredShipments.length} of {shipments.length} shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estimated Delivery</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => {
                const StatusIcon = statusConfig[shipment.status].icon
                const carrierInfo = carrierConfig[shipment.carrier as keyof typeof carrierConfig] || carrierConfig.Other

                return (
                  <TableRow key={shipment._id}>
                    <TableCell className="font-medium">
                      {typeof shipment.orderId === 'object' ? 
                        (shipment.orderId.orderNumber || shipment.orderId._id) : 
                        shipment.orderId
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{carrierInfo.icon}</span>
                        <span>{shipment.carrier}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {shipment.trackingNumber ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => openTrackingDialog(shipment)}
                        >
                          {shipment.trackingNumber}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">No tracking</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={shipment.status}
                        onValueChange={(value) => handleStatusUpdate(shipment._id, value as Shipping['status'])}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <Badge variant="secondary" className={statusConfig[shipment.status].color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {shipment.status.replace('_', ' ')}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="in_transit">In Transit</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {shipment.estimatedDelivery ? 
                        new Date(shipment.estimatedDelivery).toLocaleDateString() : 
                        'Not set'
                      }
                    </TableCell>
                    <TableCell>{new Date(shipment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(shipment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteShipment(shipment._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Shipment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Shipment</DialogTitle>
            <DialogDescription>
              Add a new shipment record for an order
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderId" className="text-right">
                Order ID
              </Label>
              <Input
                id="orderId"
                placeholder="Enter order ID"
                className="col-span-3"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carrier" className="text-right">
                Carrier
              </Label>
              <Select
                value={formData.carrier}
                onValueChange={(value) => setFormData({ ...formData, carrier: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="Kenya Post">Kenya Post</SelectItem>
                  <SelectItem value="Sendy">Sendy</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trackingNumber" className="text-right">
                Tracking
              </Label>
              <Input
                id="trackingNumber"
                placeholder="Tracking number"
                className="col-span-3"
                value={formData.trackingNumber}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimatedDelivery" className="text-right">
                Est. Delivery
              </Label>
              <Input
                id="estimatedDelivery"
                type="date"
                className="col-span-3"
                value={formData.estimatedDelivery}
                onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateShipment}>Create Shipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Shipment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Shipment</DialogTitle>
            <DialogDescription>
              Update shipment information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-carrier" className="text-right">
                Carrier
              </Label>
              <Select
                value={formData.carrier}
                onValueChange={(value) => setFormData({ ...formData, carrier: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="Kenya Post">Kenya Post</SelectItem>
                  <SelectItem value="Sendy">Sendy</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-trackingNumber" className="text-right">
                Tracking
              </Label>
              <Input
                id="edit-trackingNumber"
                className="col-span-3"
                value={formData.trackingNumber}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Shipping['status'] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-estimatedDelivery" className="text-right">
                Est. Delivery
              </Label>
              <Input
                id="edit-estimatedDelivery"
                type="date"
                className="col-span-3"
                value={formData.estimatedDelivery}
                onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateShipment}>Update Shipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Shipment Tracking</DialogTitle>
            <DialogDescription>
              Track shipment progress
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Tracking: {selectedShipment.trackingNumber}</h3>
                  <p className="text-sm text-muted-foreground">Carrier: {selectedShipment.carrier}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                  selectedShipment.status === 'delivered' ? 'bg-green-50 border border-green-200' : 
                  selectedShipment.status === 'in_transit' ? 'bg-blue-50 border border-blue-200' :
                  selectedShipment.status === 'shipped' ? 'bg-purple-50 border border-purple-200' :
                  selectedShipment.status === 'cancelled' ? 'bg-red-50 border border-red-200' :
                  'bg-yellow-50 border border-yellow-200'
                }`}>
                  {(() => {
                    const StatusIcon = statusConfig[selectedShipment.status].icon
                    return <StatusIcon className="h-5 w-5" />
                  })()}
                  <div>
                    <p className="font-medium capitalize">{selectedShipment.status.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedShipment.estimatedDelivery ? 
                        `Est. delivery: ${new Date(selectedShipment.estimatedDelivery).toLocaleDateString()}` :
                        'No estimated delivery date'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(selectedShipment.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Updated: {new Date(selectedShipment.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
