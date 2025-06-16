"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { BarChart, BarChart3, Users, ShoppingCart, Package, Truck, CreditCard, Settings, LineChart, Megaphone, UserCog, RefreshCw, Clock, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Types for Product, Order, User
type Product = {
	_id: string
	name: string
	price: number
	inStock?: number
	category?: string
}

type Order = {
	_id: string
	user?: string
	total?: number
	status?: string
	createdAt?: string | number | Date
}

type User = {
	_id: string
	firstName?: string
	lastName?: string
	email: string
	role?: string
	active?: boolean
}

const SIDEBAR_ITEMS = [
	{ key: "overview", label: "Overview" },
	{ key: "products", label: "Products" },
	{ key: "inventory", label: "Inventory" },
	{ key: "orders", label: "Orders" },
	{ key: "users", label: "Users" },
	{ key: "admins", label: "Admins" },
	{ key: "payments", label: "Payments" },
	{ key: "shipping", label: "Shipping" },
	{ key: "marketing", label: "Marketing" },
	{ key: "analytics", label: "Analytics" },
	{ key: "settings", label: "Settings" },
]

export default function AdminDashboard() {
	const router = useRouter()
	const [tab, setTab] = useState("overview")
	const [products, setProducts] = useState<Product[]>([])
	const [orders, setOrders] = useState<Order[]>([])
	const [users, setUsers] = useState<User[]>([])
	const [admins, setAdmins] = useState<User[]>([])
	const [payments, setPayments] = useState<any[]>([])
	const [shipping, setShipping] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [newPayment, setNewPayment] = useState({ amount: "", status: "" })
	const [editingPayment, setEditingPayment] = useState<any | null>(null)
	const [newShipping, setNewShipping] = useState({ carrier: "", status: "" })
	const [editingShipping, setEditingShipping] = useState<any | null>(null)
	const [autoRefresh, setAutoRefresh] = useState(true)
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
	const { toast } = useToast()

	const loadDashboardData = useCallback(async (showLoading = true) => {
		try {
			if (showLoading) setLoading(true)
			const [
				products,
				orders,
				allUsers,
				payments,
				shipping,
			] = await Promise.all([
				fetch("/api/products").then((res) => res.json()),
				fetch("/api/orders").then((res) => res.json()),
				fetch("/api/users").then((res) => res.json()),
				fetch("/api/payments").then((res) => res.json()),
				fetch("/api/shipping").then((res) => res.json()),
			])

			setProducts(products)
			setOrders(orders)
			setUsers(allUsers)
			setAdmins(allUsers.filter((user: User) => user.role === "admin"))
			setPayments(payments)
			setShipping(shipping)
			setLastUpdated(new Date())
			setError("")
		} catch (error) {
			setError("Failed to load dashboard data")
		} finally {
			if (showLoading) setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadDashboardData()
	}, [loadDashboardData])

	// Auto-refresh functionality
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null
		
		if (autoRefresh && tab === "overview") {
			interval = setInterval(() => {
				loadDashboardData(false) // Refresh without showing loading
			}, 30000) // Every 30 seconds
		}
		
		return () => {
			if (interval) clearInterval(interval)
		}
	}, [autoRefresh, tab, loadDashboardData])

	// Example sales data for chart (replace with real aggregation if needed)
	const salesData = [
		{ name: "Jan", sales: 4000 },
		{ name: "Feb", sales: 3000 },
		{ name: "Mar", sales: 5000 },
		{ name: "Apr", sales: 2780 },
		{ name: "May", sales: 3890 },
	]

	// --- Payment CRUD handlers ---
	async function fetchPayments() {
		const res = await fetch("/api/payments")
		const data = await res.json()
		setPayments(data)
	}
	async function handleAddPayment() {
		try {
			await fetch("/api/payments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newPayment),
			})
			setNewPayment({ amount: "", status: "" })
			toast({ title: "Payment added", description: "Payment entry was added successfully." })
			await fetchPayments()
		} catch {
			toast({ title: "Error", description: "Failed to add payment entry.", variant: "destructive" })
		}
	}
	async function handleEditPayment() {
		try {
			await fetch(`/api/payments?id=${editingPayment._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editingPayment),
			})
			setEditingPayment(null)
			toast({ title: "Payment updated", description: "Payment entry was updated successfully." })
			await fetchPayments()
		} catch {
			toast({ title: "Error", description: "Failed to update payment entry.", variant: "destructive" })
		}
	}
	async function handleDeletePayment(id: string) {
		try {
			await fetch(`/api/payments?id=${id}`, { method: "DELETE" })
			toast({ title: "Payment deleted", description: "Payment entry was deleted successfully." })
			await fetchPayments()
		} catch {
			toast({ title: "Error", description: "Failed to delete payment entry.", variant: "destructive" })
		}
	}
	// --- Shipping CRUD handlers ---
	async function fetchShipping() {
		const res = await fetch("/api/shipping")
		const data = await res.json()
		setShipping(data)
	}
	async function handleAddShipping() {
		try {
			await fetch("/api/shipping", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newShipping),
			})
			setNewShipping({ carrier: "", status: "" })
			toast({ title: "Shipping added", description: "Shipping entry was added successfully." })
			await fetchShipping()
		} catch {
			toast({ title: "Error", description: "Failed to add shipping entry.", variant: "destructive" })
		}
	}
	async function handleEditShipping() {
		try {
			await fetch(`/api/shipping?id=${editingShipping._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editingShipping),
			})
			setEditingShipping(null)
			toast({ title: "Shipping updated", description: "Shipping entry was updated successfully." })
			await fetchShipping()
		} catch {
			toast({ title: "Error", description: "Failed to update shipping entry.", variant: "destructive" })
		}
	}
	async function handleDeleteShipping(id: string) {
		try {
			await fetch(`/api/shipping?id=${id}`, { method: "DELETE" })
			toast({ title: "Shipping deleted", description: "Shipping entry was deleted successfully." })
			await fetchShipping()
		} catch {
			toast({ title: "Error", description: "Failed to delete shipping entry.", variant: "destructive" })
		}	}

	return (		<div className="flex min-h-screen bg-gray-50">
			{/* Enhanced Sidebar Navigation */}
			<aside className="w-72 h-screen min-h-0 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
				<div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
					<div className="px-6 pt-6 pb-4">
						<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							Admin Dashboard
						</h1>
						<p className="text-xs text-gray-400 mt-1">Spectacles E-commerce</p>
					</div>
				</div>
				
				<nav className="flex-1 min-h-0 overflow-y-auto px-4 pb-6">
					<div className="flex flex-col gap-2 pt-6">
						{/* Main Navigation Section */}
						<div className="mb-4">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
								Main
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => setTab("overview")}
									className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
										tab === "overview" 
											? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105" 
											: "text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105"
									}`}
								>
									<BarChart className="w-5 h-5 mr-3" />
									<span className="font-medium">Overview</span>
									{tab === "overview" && <div className="ml-auto w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>}
								</button>
							</div>
						</div>

						{/* Management Section */}
						<div className="mb-4">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
								Management
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => router.push('/admin/products')}
									className="w-full flex items-center px-4 py-3 rounded-xl text-left text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-200 group"
								>
									<Package className="w-5 h-5 mr-3" />
									<span className="font-medium">Products</span>
									<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
									</div>
								</button>
								
								<button 
									onClick={() => router.push('/admin/inventory')}
									className="w-full flex items-center px-4 py-3 rounded-xl text-left text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-200 group"
								>
									<BarChart3 className="w-5 h-5 mr-3" />
									<span className="font-medium">Inventory</span>
									<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
									</div>
								</button>
								
								<button 
									onClick={() => router.push('/admin/orders')}
									className="w-full flex items-center px-4 py-3 rounded-xl text-left text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-200 group"
								>
									<ShoppingCart className="w-5 h-5 mr-3" />
									<span className="font-medium">Orders</span>
									<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
									</div>
								</button>
							</div>
						</div>

						{/* Users & Admin Section */}
						<div className="mb-4">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
								Users & Access
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => router.push('/admin/users')}
									className="w-full flex items-center px-4 py-3 rounded-xl text-left text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-200 group"
								>
									<Users className="w-5 h-5 mr-3" />
									<span className="font-medium">Users</span>
									<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
									</div>
								</button>
								
								<button 
									onClick={() => setTab("admins")}
									className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
										tab === "admins" 
											? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105" 
											: "text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105"
									}`}
								>
									<UserCog className="w-5 h-5 mr-3" />
									<span className="font-medium">Admins</span>
									{tab === "admins" && <div className="ml-auto w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>}
								</button>
							</div>
						</div>

						{/* Finance Section */}
						<div className="mb-4">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
								Finance & Operations
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => setTab("payments")}
									className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
										tab === "payments" 
											? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105" 
											: "text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105"
									}`}
								>
									<CreditCard className="w-5 h-5 mr-3" />
									<span className="font-medium">Payments</span>
									{tab === "payments" && <div className="ml-auto w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>}
								</button>
								
								<button 
									onClick={() => setTab("shipping")}
									className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
										tab === "shipping" 
											? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg transform scale-105" 
											: "text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105"
									}`}
								>
									<Truck className="w-5 h-5 mr-3" />
									<span className="font-medium">Shipping</span>
									{tab === "shipping" && <div className="ml-auto w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>}
								</button>
							</div>
						</div>

						{/* Analytics & Marketing Section */}
						<div className="mb-4">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
								Analytics & Growth
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => router.push('/admin/marketing')}
									className="w-full flex items-center px-4 py-3 rounded-xl text-left text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-200 group"
								>
									<Megaphone className="w-5 h-5 mr-3" />
									<span className="font-medium">Marketing</span>
									<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
									</div>
								</button>
								
								<button 
									onClick={() => router.push('/admin/analytics')}
									className="w-full flex items-center px-4 py-3 rounded-xl text-left text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-200 group"
								>
									<LineChart className="w-5 h-5 mr-3" />
									<span className="font-medium">Analytics</span>
									<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
									</div>
								</button>
							</div>
						</div>

						{/* Settings Section */}
						<div className="mb-4">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
								Configuration
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => router.push('/admin/settings')}
									className="w-full flex items-center px-4 py-3 rounded-xl text-left text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 transition-all duration-200 group"
								>
									<Settings className="w-5 h-5 mr-3" />
									<span className="font-medium">Settings</span>
									<div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
									</div>
								</button>
							</div>
						</div>
					</div>
				</nav>
				
				{/* Footer */}
				<div className="p-4 border-t border-gray-700">
					<div className="text-xs text-gray-400 text-center">
						<p>Admin Panel v2.0</p>
						<p className="mt-1">© 2025 Spectacles</p>
					</div>
				</div>
			</aside>			{/* Main Content */}
			<main className="flex-1 p-8 bg-gray-50 min-h-screen overflow-x-auto">
				<div className="max-w-7xl mx-auto">
					{/* Overview */}
					{tab === "overview" && (
						<div className="space-y-6">
							{/* Header with Real-time Controls */}
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-3xl font-bold">Dashboard Overview</h1>
									<p className="text-gray-600 mt-1">Real-time business metrics and insights</p>
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
									
									<Button variant="outline" size="sm" onClick={() => loadDashboardData()}>
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
												<span className="text-sm font-medium">Live Dashboard</span>
											</div>
											<div className="text-sm text-gray-600">
												<Users className="h-4 w-4 inline mr-1" />
												{users.length} registered users
											</div>
											<div className="text-sm text-gray-600">
												<Package className="h-4 w-4 inline mr-1" />
												{products.length} products
											</div>
										</div>
										<div className="text-sm text-gray-500">
											Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
										</div>
									</div>
								</CardContent>
							</Card>							{/* Enhanced Statistics Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setTab("payments")}>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-gray-600">Total Sales</p>
												<p className="text-3xl font-bold text-green-600">
													KSh {orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}
												</p>
												<p className="text-xs text-green-600 flex items-center mt-1">
													<TrendingUp className="h-3 w-3 mr-1" />
													+12.5% from last month
												</p>
											</div>
											<div className="p-3 bg-green-100 rounded-full">
												<CreditCard className="h-6 w-6 text-green-600" />
											</div>
										</div>
										<Button 
											variant="ghost" 
											size="sm" 
											className="w-full mt-4 text-green-600 hover:bg-green-50"
											onClick={(e) => {
												e.stopPropagation()
												setTab("payments")
											}}
										>
											View Payments →
										</Button>
									</CardContent>
								</Card>

								<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/orders')}>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-gray-600">Total Orders</p>
												<p className="text-3xl font-bold text-blue-600">{orders.length}</p>
												<p className="text-xs text-blue-600 flex items-center mt-1">
													<TrendingUp className="h-3 w-3 mr-1" />
													+8.2% from last month
												</p>
											</div>
											<div className="p-3 bg-blue-100 rounded-full">
												<ShoppingCart className="h-6 w-6 text-blue-600" />
											</div>
										</div>
										<Button 
											variant="ghost" 
											size="sm" 
											className="w-full mt-4 text-blue-600 hover:bg-blue-50"
											onClick={(e) => {
												e.stopPropagation()
												router.push('/admin/orders')
											}}
										>
											Manage Orders →
										</Button>
									</CardContent>
								</Card>

								<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/users')}>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-gray-600">Total Users</p>
												<p className="text-3xl font-bold text-purple-600">{users.length}</p>
												<p className="text-xs text-purple-600 flex items-center mt-1">
													<TrendingUp className="h-3 w-3 mr-1" />
													+15.3% from last month
												</p>
											</div>
											<div className="p-3 bg-purple-100 rounded-full">
												<Users className="h-6 w-6 text-purple-600" />
											</div>
										</div>
										<Button 
											variant="ghost" 
											size="sm" 
											className="w-full mt-4 text-purple-600 hover:bg-purple-50"
											onClick={(e) => {
												e.stopPropagation()
												router.push('/admin/users')
											}}
										>
											Manage Users →
										</Button>
									</CardContent>
								</Card>

								<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/products')}>
									<CardContent className="p-6">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-gray-600">Products</p>
												<p className="text-3xl font-bold text-orange-600">{products.length}</p>
												<p className="text-xs text-orange-600 flex items-center mt-1">
													<TrendingUp className="h-3 w-3 mr-1" />
													+5.7% from last month
												</p>
											</div>
											<div className="p-3 bg-orange-100 rounded-full">
												<Package className="h-6 w-6 text-orange-600" />
											</div>
										</div>
										<Button 
											variant="ghost" 
											size="sm" 
											className="w-full mt-4 text-orange-600 hover:bg-orange-50"
											onClick={(e) => {
												e.stopPropagation()
												router.push('/admin/products')
											}}
										>
											Manage Products →
										</Button>
									</CardContent>
								</Card>
							</div>

							{/* Quick Actions and Alerts */}
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Quick Actions</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<Button 
											className="w-full justify-start" 
											variant="outline"
											onClick={() => router.push('/admin/orders')}
										>
											<ShoppingCart className="h-4 w-4 mr-2" />
											View All Orders
										</Button>
										<Button 
											className="w-full justify-start" 
											variant="outline"
											onClick={() => router.push('/admin/products')}
										>
											<Package className="h-4 w-4 mr-2" />
											Manage Products
										</Button>
										<Button 
											className="w-full justify-start" 
											variant="outline"
											onClick={() => router.push('/admin/analytics')}
										>
											<LineChart className="h-4 w-4 mr-2" />
											View Analytics
										</Button>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="text-lg">System Alerts</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
											<div className="flex items-center gap-2">
												<Package className="h-4 w-4 text-yellow-600" />
												<span className="text-sm font-medium text-yellow-800">
													Low Stock Alert
												</span>
											</div>
											<p className="text-xs text-yellow-700 mt-1">
												{products.filter(p => (p.inStock || 0) < 10).length} products running low
											</p>
										</div>
										
										<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
											<div className="flex items-center gap-2">
												<ShoppingCart className="h-4 w-4 text-blue-600" />
												<span className="text-sm font-medium text-blue-800">
													Pending Orders
												</span>
											</div>
											<p className="text-xs text-blue-700 mt-1">
												{orders.filter(o => o.status === 'pending').length} orders awaiting processing
											</p>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Recent Activity</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{orders.slice(0, 3).map((order, index) => (
											<div key={order._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
												<div className="w-2 h-2 bg-green-500 rounded-full"></div>
												<div className="flex-1">
													<p className="text-sm font-medium">New Order</p>
													<p className="text-xs text-gray-500">
														KSh {order.total?.toLocaleString()} • {new Date(order.createdAt || '').toLocaleDateString()}
													</p>
												</div>
											</div>
										))}
									</CardContent>
								</Card>
							</div>
						</div>
					)}

					{/* Admins */}
					{tab === "admins" && (
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<UserCog className="h-5 w-5" />
										Admin Users ({admins.length})
									</CardTitle>									<Button 
										onClick={() => router.push('/admin/users?filter=admin')}
										size="sm"
									>
										<UserCog className="h-4 w-4 mr-2" />
										Manage Admins
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{admins.length === 0 ? (
									<div className="text-center py-8">
										<UserCog className="h-12 w-12 mx-auto text-gray-400 mb-4" />
										<p className="text-gray-500 mb-4">No admin users found</p>										<Button 
											onClick={() => router.push('/admin/users')}
											variant="outline"
										>
											Create Admin User
										</Button>
									</div>
								) : (
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Name</TableCell>
												<TableCell>Email</TableCell>
												<TableCell>Role</TableCell>
												<TableCell>Status</TableCell>
												<TableCell>Last Login</TableCell>
												<TableCell>Actions</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{admins.slice(0, 5).map((admin) => (
												<TableRow key={admin._id}>
													<TableCell>
														<div>
															<div className="font-medium">{admin.firstName} {admin.lastName}</div>
															<div className="text-sm text-gray-500">ID: {admin._id.slice(-8)}</div>
														</div>
													</TableCell>
													<TableCell>{admin.email}</TableCell>
													<TableCell>
														<div className="flex items-center gap-1">
															<UserCog className="h-4 w-4 text-purple-600" />
															<span className="text-purple-600 font-medium">Admin</span>
														</div>
													</TableCell>
													<TableCell>
														<span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
															Active
														</span>
													</TableCell>
													<TableCell className="text-sm text-gray-500">Recently</TableCell>
													<TableCell>														<Button 
															size="sm" 
															variant="outline"
															onClick={() => router.push(`/admin/users?edit=${admin._id}`)}
														>
															Edit
														</Button>
													</TableCell>
												</TableRow>
											))}
											{admins.length > 5 && (
												<TableRow>
													<TableCell colSpan={6} className="text-center py-4">														<Button 
															variant="ghost" 
															onClick={() => router.push('/admin/users?filter=admin')}
														>
															View all {admins.length} admin users →
														</Button>
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					)}

					{/* Payments */}
					{tab === "payments" && (
						<Card>
							<CardHeader><CardTitle>Payments</CardTitle></CardHeader>
							<CardContent>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Payment ID</TableCell>
											<TableCell>Order</TableCell>
											<TableCell>User</TableCell>
											<TableCell>Amount</TableCell>
											<TableCell>Method</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Date</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{payments.map((payment) => (
											<TableRow key={payment._id}>
												<TableCell>PMT-{payment._id.slice(-6)}</TableCell>
												<TableCell>#{payment.orderId || 'N/A'}</TableCell>
												<TableCell>{payment.user || 'Unknown'}</TableCell>
												<TableCell>KSh {payment.amount}</TableCell>
												<TableCell>{payment.method || 'Mpesa'}</TableCell>
												<TableCell>{payment.status}</TableCell>
												<TableCell>{new Date(payment.createdAt || Date.now()).toLocaleDateString()}</TableCell>
											</TableRow>
										))}
										{payments.length === 0 && (
											<TableRow>
												<TableCell colSpan={7} className="text-center text-gray-500">No payments found</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}

					{/* Shipping */}
					{tab === "shipping" && (
						<Card>
							<CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
							<CardContent>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Order ID</TableCell>
											<TableCell>User</TableCell>
											<TableCell>Address</TableCell>
											<TableCell>Method</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Tracking</TableCell>
											<TableCell>Actions</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{shipping.map((shipment) => (
											<TableRow key={shipment._id}>
												<TableCell>#{shipment.orderId || shipment._id.slice(-6)}</TableCell>
												<TableCell>{shipment.user || 'Unknown'}</TableCell>
												<TableCell>{shipment.address || '123 Main St'}</TableCell>
												<TableCell>{shipment.method || 'Standard'}</TableCell>
												<TableCell>{shipment.status || 'Pending'}</TableCell>
												<TableCell>{shipment.tracking || 'TRK' + shipment._id.slice(-5)}</TableCell>
												<TableCell><Button size="sm">Update</Button></TableCell>
											</TableRow>
										))}
										{shipping.length === 0 && (
											<TableRow>
												<TableCell colSpan={7} className="text-center text-gray-500">No shipping records found</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>					)}
				</div>
			</main>
		</div>
	);
}
