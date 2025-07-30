"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  RefreshCw, 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  XCircle
} from "lucide-react";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = useCallback(async (showLoading = true) => {
    if (!id) return;
    
    try {
      if (showLoading) setLoading(true);
      setError("");
      
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      
      if (res.ok) {
        setOrder(data);
        setStatus(data.status);
        setLastUpdated(new Date());
      } else {
        setError("Failed to load order details");
      }
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (autoRefresh && order) {
      interval = setInterval(() => {
        fetchOrder(false); // Refresh without showing loading
      }, 30000); // Every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, order, fetchOrder]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setUpdating(true);
    setError("");
    
    try {
      const res = await fetch(`/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, status: newStatus }),
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      
      setOrder((prev: any) => ({ ...prev, status: newStatus }));
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to update status");
      // Revert status on error
      setStatus(order?.status || "pending");
    } finally {
      setUpdating(false);
    }
  };

  const handleRefresh = () => {
    fetchOrder();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <Button onClick={() => fetchOrder()}>Try Again</Button>
        </div>
      </Card>
    );
  }
  
  if (!order) {
    return (
      <Card className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <div className="text-lg text-gray-600">Order not found</div>
        </div>
      </Card>
    );
  }
  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package className="h-8 w-8" />
              Order Details
            </h1>
            <p className="text-gray-600 mt-1">Order #{order._id}</p>
          </div>
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
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
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
                <span className="text-sm font-medium">Real-time tracking</span>
              </div>
              <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Order ID</label>
                  <p className="text-lg font-mono">{order._id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-lg">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Order Status</label>
                <Select 
                  value={status} 
                  onValueChange={handleStatusChange}
                  disabled={updating}
                >
                  <SelectTrigger className="w-48">
                    <div className="flex items-center gap-2">
                      {updating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        getStatusIcon(status)
                      )}
                      <SelectValue />
                    </div>
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
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md" 
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Color: {item.color}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KSh {item.price?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        Total: KSh {(item.price * item.quantity)?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>KSh {order.total?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>            <CardContent>
              {order.user && typeof order.user === 'object' ? (
                <div className="space-y-2">
                  <p className="font-medium">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{order.user.email}</p>
                </div>
              ) : (
                <p className="text-gray-500">Guest User</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{order.shippingAddress?.street}</p>
                {order.shippingAddress?.apartment && (
                  <p>{order.shippingAddress.apartment}</p>
                )}
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>{order.shippingAddress?.zipCode}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.paymentMethod?.type}</p>
                {order.paymentMethod?.lastFour && (
                  <p className="text-sm text-gray-600">
                    ****{order.paymentMethod.lastFour}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
