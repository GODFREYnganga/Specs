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

export default function AdminDashboard() {	const router = useRouter()
	const [tab, setTab] = useState("overview")
	const [products, setProducts] = useState<Product[]>([])
	const [orders, setOrders] = useState<Order[]>([])
	const [users, setUsers] = useState<User[]>([])
	const [admins, setAdmins] = useState<User[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
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
			] = await Promise.all([
				fetch("/api/products").then((res) => res.json()),
				fetch("/api/orders").then((res) => res.json()),
				fetch("/api/users").then((res) => res.json()),
			])

			setProducts(products)
			setOrders(orders)
			setUsers(allUsers)
			setAdmins(allUsers.filter((user: User) => user.role === "admin"))
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
	return (<div className="flex h-screen bg-gray-50 overflow-hidden">
			{/* Optimized Sidebar Navigation */}
			<aside className="w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
				<div className="flex-shrink-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
					<div className="px-4 py-4">
						<h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							Admin Dashboard
						</h1>
						<p className="text-xs text-gray-400 mt-1">Spectacles E-commerce</p>
					</div>
				</div>				
				<nav className="flex-1 overflow-y-auto px-3 py-4">
					<div className="flex flex-col gap-1">
						{/* Main Navigation Section */}
						<div className="mb-3">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
								Main
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => setTab("overview")}
									className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
										tab === "overview" 
											? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
											: "text-gray-300 hover:bg-gray-800 hover:text-white"
									}`}
								>
									<BarChart className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Overview</span>
									{tab === "overview" && <div className="ml-auto w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>}
								</button>
							</div>
						</div>

						{/* Management Section */}
						<div className="mb-3">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
								Management
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => router.push('/admin/products')}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<Package className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Products</span>
								</button>
								
								<button 
									onClick={() => router.push('/admin/inventory')}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<BarChart3 className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Inventory</span>
								</button>
								
								<button 
									onClick={() => router.push('/admin/orders')}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<ShoppingCart className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Orders</span>
								</button>
							</div>
						</div>

						{/* Users & Admin Section */}
						<div className="mb-3">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
								Users & Access
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => router.push('/admin/users')}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<Users className="w-4 h-4 mr-3" />									<span className="font-medium text-sm">Users</span>
								</button>
								
								<button 
									onClick={() => setTab("admins")}
									className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
										tab === "admins" 
											? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg" 
											: "text-gray-300 hover:bg-gray-800 hover:text-white"
									}`}
								>
									<UserCog className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Admins</span>
									{tab === "admins" && <div className="ml-auto w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>}
								</button>
							</div>
						</div>

						{/* Finance Section */}
						<div className="mb-3">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
								Finance & Operations
							</h3>
							<div className="space-y-1">								<button 
									onClick={() => router.push('/admin/payments')}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<CreditCard className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Payments</span>
								</button>
								
								<button 
									onClick={() => router.push('/admin/shipping')}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<Truck className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Shipping</span>
								</button>
							</div>
						</div>

						{/* Analytics & Marketing Section */}
						<div className="mb-3">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
								Analytics & Growth
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => router.push('/admin/marketing')}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<Megaphone className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Marketing</span>
								</button>
								
								<button 
									onClick={() => router.push('/admin/analytics')}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<LineChart className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Analytics</span>
								</button>
							</div>
						</div>

						{/* Settings Section */}
						<div className="mb-3">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
								Configuration
							</h3>
							<div className="space-y-1">
								<button 
									onClick={() => router.push('/admin/settings')}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<Settings className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Settings</span>
								</button>
							</div>
						</div>
					</div>
				</nav>
				
				{/* Footer */}
				<div className="flex-shrink-0 p-3 border-t border-gray-700">
					<div className="text-xs text-gray-400 text-center">
						<p>Admin Panel v2.0</p>
						<p className="mt-1">© 2025 Spectacles</p>
					</div>
				</div>
			</aside>			{/* Main Content */}
			<main className="flex-1 bg-gray-50 h-full overflow-auto">
				<div className="h-full p-4">					{/* Overview */}
					{tab === "overview" && (
						<div className="space-y-4">
							{/* Header with Real-time Controls */}
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-2xl font-bold">Dashboard Overview</h1>
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
								<CardContent className="p-3">
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
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">								<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setTab("payments")}>
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-gray-600">Total Sales</p>
												<p className="text-2xl font-bold text-green-600">
													KSh {orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}
												</p>
												<p className="text-xs text-green-600 flex items-center mt-1">
													<TrendingUp className="h-3 w-3 mr-1" />
													+12.5% from last month
												</p>
											</div>
											<div className="p-2 bg-green-100 rounded-full">
												<CreditCard className="h-5 w-5 text-green-600" />
											</div>
										</div>
										<Button 
											variant="ghost" 
											size="sm" 
											className="w-full mt-3 text-green-600 hover:bg-green-50"
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
						</Card>					)}
				</div>
			</main>
		</div>
	);
}
