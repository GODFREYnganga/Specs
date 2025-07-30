"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { BarChart, BarChart3, Users, ShoppingCart, Package, Truck, CreditCard, Settings, LineChart, Megaphone, UserCog, RefreshCw, Clock, TrendingUp, Menu, X } from "lucide-react"
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
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { toast } = useToast()
	const loadDashboardData = useCallback(async (showLoading = true) => {
		try {
			if (showLoading) setLoading(true)
			const [
				productsResponse,
				ordersResponse,
				usersResponse,
			] = await Promise.all([
				fetch("/api/eyewear-products").then((res) => res.json()),
				fetch("/api/orders").then((res) => res.json()),
				fetch("/api/users").then((res) => res.json()),
			])

			// Ensure products is always an array
			const products = Array.isArray(productsResponse) ? productsResponse : []
			// Ensure orders is always an array
			const orders = Array.isArray(ordersResponse) ? ordersResponse : []
			// Ensure users is always an array
			const allUsers = Array.isArray(usersResponse) ? usersResponse : []

			setProducts(products)
			setOrders(orders)
			setUsers(allUsers)
			setAdmins(allUsers.filter((user: User) => user.role === "admin"))
			setLastUpdated(new Date())
			setError("")
		} catch (error) {
			console.error("Dashboard data loading error:", error)
			setError("Failed to load dashboard data")
			// Set empty arrays as fallbacks
			setProducts([])
			setOrders([])
			setUsers([])
			setAdmins([])
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
	}, [autoRefresh, tab, loadDashboardData])	// Example sales data for chart (replace with real aggregation if needed)
	const salesData = [
		{ name: "Jan", sales: 4000 },
		{ name: "Feb", sales: 3000 },
		{ name: "Mar", sales: 5000 },
		{ name: "Apr", sales: 2780 },
		{ name: "May", sales: 3890 },
	];
	
	return (<div className="flex h-screen bg-gray-50 overflow-hidden">
			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Responsive Sidebar Navigation */}
			<aside className={`
				${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
				fixed lg:static inset-y-0 left-0 z-50 w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:transition-none
			`}>				<div className="flex-shrink-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
					<div className="px-4 py-4">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
									Admin Dashboard
								</h1>
								<p className="text-xs text-gray-400 mt-1">Spectacles E-commerce</p>
							</div>
							{/* Mobile close button */}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSidebarOpen(false)}
								className="lg:hidden p-1 text-gray-400 hover:text-white"
							>
								<X className="h-5 w-5" />
							</Button>
						</div>
					</div>
				</div>
				<nav className="flex-1 overflow-y-auto px-3 py-4">
					<div className="flex flex-col gap-1">
						{/* Main Navigation Section */}
						<div className="mb-3">
							<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
								Main
							</h3>							<div className="space-y-1">
								<button 
									onClick={() => {
										setTab("overview")
										setSidebarOpen(false)
									}}
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
							</h3>							<div className="space-y-1">
								<button 
									onClick={() => {
										router.push('/admin/products')
										setSidebarOpen(false)
									}}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<Package className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Products</span>
								</button>
								
								<button 
									onClick={() => {
										router.push('/admin/inventory')
										setSidebarOpen(false)
									}}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<BarChart3 className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Inventory</span>
								</button>
								
								<button 
									onClick={() => {
										router.push('/admin/orders')
										setSidebarOpen(false)
									}}
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
							</h3>							<div className="space-y-1">
								<button 
									onClick={() => {
										router.push('/admin/users')
										setSidebarOpen(false)
									}}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<Users className="w-4 h-4 mr-3" />									<span className="font-medium text-sm">Users</span>
								</button>
								
								<button 
									onClick={() => {
										setTab("admins")
										setSidebarOpen(false)
									}}
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
							</h3>							<div className="space-y-1">								<button 
									onClick={() => {
										router.push('/admin/payments')
										setSidebarOpen(false)
									}}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<CreditCard className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Payments</span>
								</button>
								
								<button 
									onClick={() => {
										router.push('/admin/shipping')
										setSidebarOpen(false)
									}}
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
							</h3>							<div className="space-y-1">
								<button 
									onClick={() => {
										router.push('/admin/marketing')
										setSidebarOpen(false)
									}}
									className="w-full flex items-center px-3 py-2.5 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
								>
									<Megaphone className="w-4 h-4 mr-3" />
									<span className="font-medium text-sm">Marketing</span>
								</button>
								
								<button 
									onClick={() => {
										router.push('/admin/analytics')
										setSidebarOpen(false)
									}}
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
							</h3>							<div className="space-y-1">
								<button 
									onClick={() => {
										router.push('/admin/settings')
										setSidebarOpen(false)
									}}
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
			<main className="flex-1 bg-gray-50 h-full overflow-auto lg:ml-0">
				{/* Mobile Header */}
				<div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
					<div>
						<h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
						<p className="text-xs text-gray-500">Spectacles E-commerce</p>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSidebarOpen(true)}
						className="p-2"
					>
						<Menu className="h-5 w-5" />
					</Button>
				</div>

				<div className="h-full p-3 sm:p-4 lg:p-6">{/* Overview */}
					{tab === "overview" && (						<div className="space-y-4">
							{/* Header with Real-time Controls */}
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div>
									<h1 className="text-xl sm:text-2xl font-bold">Dashboard Overview</h1>
									<p className="text-gray-600 mt-1 text-sm sm:text-base">Real-time business metrics and insights</p>
								</div>
								
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
									<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
										<Clock className="h-4 w-4" />
										<span className="truncate">{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Not updated'}</span>
									</div>
									
									<div className="flex gap-2">
										<Button 
											variant={autoRefresh ? "default" : "outline"} 
											size="sm" 
											onClick={() => setAutoRefresh(!autoRefresh)}
											className="text-xs"
										>
											<RefreshCw className={`h-4 w-4 mr-1 sm:mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
											<span className="hidden sm:inline">Auto-refresh</span>
											<span className="sm:hidden">Auto</span>
										</Button>
										
										<Button variant="outline" size="sm" onClick={() => loadDashboardData()} className="text-xs">
											<RefreshCw className="h-4 w-4 mr-1 sm:mr-2" />
											<span className="hidden sm:inline">Refresh</span>
											<span className="sm:hidden">↻</span>
										</Button>
									</div>
								</div>
							</div>							{/* Real-time Status Indicator */}
							<Card>
								<CardContent className="p-3">
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
										<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
											<div className="flex items-center gap-2">
												<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
												<span className="text-sm font-medium">Live Dashboard</span>
											</div>											<div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
												<div className="flex items-center">
													<Users className="h-4 w-4 mr-1" />
													{Array.isArray(users) ? users.length : 0} users
												</div>
												<div className="flex items-center">
													<Package className="h-4 w-4 mr-1" />
													{Array.isArray(products) ? products.length : 0} products
												</div>
											</div>
										</div>
										<div className="text-xs sm:text-sm text-gray-500">
											Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
										</div>
									</div>
								</CardContent>
							</Card>							{/* Enhanced Statistics Cards */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">								<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setTab("payments")}>
									<CardContent className="p-3 sm:p-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-xs sm:text-sm font-medium text-gray-600">Total Sales</p>
												<p className="text-xl sm:text-2xl font-bold text-green-600">
													KSh {orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString()}
												</p>
												<p className="text-xs text-green-600 flex items-center mt-1">
													<TrendingUp className="h-3 w-3 mr-1" />
													+12.5% from last month
												</p>
											</div>
											<div className="p-2 bg-green-100 rounded-full">
												<CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
											</div>
										</div>
										<Button 
											variant="ghost" 
											size="sm" 
											className="w-full mt-2 sm:mt-3 text-green-600 hover:bg-green-50 text-xs sm:text-sm"
											onClick={(e) => {
												e.stopPropagation()
												setTab("payments")
											}}
										>
											View Payments →
										</Button>
									</CardContent>
								</Card>								<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/orders')}>
									<CardContent className="p-3 sm:p-6">
										<div className="flex items-center justify-between">											<div>
												<p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
												<p className="text-xl sm:text-3xl font-bold text-blue-600">{Array.isArray(orders) ? orders.length : 0}</p>
												<p className="text-xs text-blue-600 flex items-center mt-1">
													<TrendingUp className="h-3 w-3 mr-1" />
													+8.2% from last month
												</p>
											</div>
											<div className="p-2 sm:p-3 bg-blue-100 rounded-full">
												<ShoppingCart className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
											</div>
										</div>
										<Button 
											variant="ghost" 
											size="sm" 
											className="w-full mt-2 sm:mt-4 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
											onClick={(e) => {
												e.stopPropagation()
												router.push('/admin/orders')
											}}
										>
											Manage Orders →
										</Button>
									</CardContent>
								</Card>								<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/users')}>
									<CardContent className="p-3 sm:p-6">
										<div className="flex items-center justify-between">											<div>
												<p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
												<p className="text-xl sm:text-3xl font-bold text-purple-600">{Array.isArray(users) ? users.length : 0}</p>
												<p className="text-xs text-purple-600 flex items-center mt-1">
													<TrendingUp className="h-3 w-3 mr-1" />
													+15.3% from last month
												</p>
											</div>
											<div className="p-2 sm:p-3 bg-purple-100 rounded-full">
												<Users className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
											</div>
										</div>
										<Button 
											variant="ghost" 
											size="sm" 
											className="w-full mt-2 sm:mt-4 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm"
											onClick={(e) => {
												e.stopPropagation()
												router.push('/admin/users')
											}}
										>
											Manage Users →
										</Button>
									</CardContent>
								</Card>								<Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/products')}>
									<CardContent className="p-3 sm:p-6">
										<div className="flex items-center justify-between">											<div>
												<p className="text-xs sm:text-sm font-medium text-gray-600">Products</p>
												<p className="text-xl sm:text-3xl font-bold text-orange-600">{Array.isArray(products) ? products.length : 0}</p>
												<p className="text-xs text-orange-600 flex items-center mt-1">
													<TrendingUp className="h-3 w-3 mr-1" />
													+5.7% from last month
												</p>
											</div>
											<div className="p-2 sm:p-3 bg-orange-100 rounded-full">
												<Package className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
											</div>
										</div>
										<Button 
											variant="ghost" 
											size="sm" 
											className="w-full mt-2 sm:mt-4 text-orange-600 hover:bg-orange-50 text-xs sm:text-sm"
											onClick={(e) => {
												e.stopPropagation()
												router.push('/admin/products')
											}}
										>
											Manage Products →
										</Button>
									</CardContent>
								</Card>
							</div>							{/* Quick Actions and Alerts */}
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2 sm:space-y-3">
										<Button 
											className="w-full justify-start text-xs sm:text-sm" 
											variant="outline"
											onClick={() => router.push('/admin/orders')}
										>
											<ShoppingCart className="h-4 w-4 mr-2" />
											View All Orders
										</Button>
										<Button 
											className="w-full justify-start text-xs sm:text-sm" 
											variant="outline"
											onClick={() => router.push('/admin/products')}
										>
											<Package className="h-4 w-4 mr-2" />
											Manage Products
										</Button>
										<Button 
											className="w-full justify-start text-xs sm:text-sm" 
											variant="outline"
											onClick={() => router.push('/admin/analytics')}
										>
											<LineChart className="h-4 w-4 mr-2" />
											View Analytics
										</Button>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="text-base sm:text-lg">System Alerts</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2 sm:space-y-3">
										<div className="p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
											<div className="flex items-center gap-2">
												<Package className="h-4 w-4 text-yellow-600" />
												<span className="text-xs sm:text-sm font-medium text-yellow-800">
													Low Stock Alert
												</span>
											</div>											<p className="text-xs text-yellow-700 mt-1">
												{Array.isArray(products) ? products.filter(p => (p.inStock || 0) < 10).length : 0} products running low
											</p>
										</div>
										
										<div className="p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
											<div className="flex items-center gap-2">
												<ShoppingCart className="h-4 w-4 text-blue-600" />
												<span className="text-xs sm:text-sm font-medium text-blue-800">
													Pending Orders
												</span>
											</div>											<p className="text-xs text-blue-700 mt-1">
												{Array.isArray(orders) ? orders.filter(o => o.status === 'pending').length : 0} orders awaiting processing
											</p>
										</div>
									</CardContent>
								</Card>

								<Card className="md:col-span-2 xl:col-span-1">
									<CardHeader className="pb-3">
										<CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
									</CardHeader>									<CardContent className="space-y-2 sm:space-y-3">
										{Array.isArray(orders) ? orders.slice(0, 3).map((order, index) => (
											<div key={order._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
												<div className="w-2 h-2 bg-green-500 rounded-full"></div>
												<div className="flex-1 min-w-0">
													<p className="text-xs sm:text-sm font-medium">New Order</p>
													<p className="text-xs text-gray-500 truncate">
														KSh {order.total?.toLocaleString()} • {new Date(order.createdAt || '').toLocaleDateString()}
													</p>
												</div>
											</div>
										)) : (
											<div className="text-center py-4 text-gray-500 text-xs sm:text-sm">
												No recent orders
											</div>
										)}
									</CardContent>
								</Card>
							</div>
						</div>
					)}					{/* Admins */}
					{tab === "admins" && (
						<Card>
							<CardHeader>
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">									<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
										<UserCog className="h-5 w-5" />
										Admin Users ({Array.isArray(admins) ? admins.length : 0})
									</CardTitle><Button 
										onClick={() => router.push('/admin/users?filter=admin')}
										size="sm"
										className="self-start sm:self-auto"
									>
										<UserCog className="h-4 w-4 mr-2" />
										Manage Admins
									</Button>
								</div>
							</CardHeader>							<CardContent>
								{!Array.isArray(admins) || admins.length === 0 ? (
									<div className="text-center py-8">
										<UserCog className="h-12 w-12 mx-auto text-gray-400 mb-4" />
										<p className="text-gray-500 mb-4">No admin users found</p><Button 
											onClick={() => router.push('/admin/users')}
											variant="outline"
										>
											Create Admin User
										</Button>
									</div>
								) : (
									<div className="overflow-x-auto">
										<Table>
											<TableHead>
												<TableRow>
													<TableCell className="text-xs sm:text-sm">Name</TableCell>
													<TableCell className="text-xs sm:text-sm hidden sm:table-cell">Email</TableCell>
													<TableCell className="text-xs sm:text-sm">Role</TableCell>
													<TableCell className="text-xs sm:text-sm hidden md:table-cell">Status</TableCell>
													<TableCell className="text-xs sm:text-sm hidden lg:table-cell">Last Login</TableCell>
													<TableCell className="text-xs sm:text-sm">Actions</TableCell>
												</TableRow>
											</TableHead>										<TableBody>
											{Array.isArray(admins) ? admins.slice(0, 5).map((admin) => (
												<TableRow key={admin._id}>
													<TableCell>
														<div>
															<div className="font-medium text-xs sm:text-sm">{admin.firstName} {admin.lastName}</div>
															<div className="text-xs text-gray-500 sm:hidden">{admin.email}</div>
															<div className="text-xs text-gray-500">ID: {admin._id.slice(-8)}</div>
														</div>
													</TableCell>
													<TableCell className="hidden sm:table-cell text-xs sm:text-sm">{admin.email}</TableCell>
													<TableCell>
														<div className="flex items-center gap-1">
															<UserCog className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
															<span className="text-purple-600 font-medium text-xs sm:text-sm">Admin</span>
														</div>
													</TableCell>
													<TableCell className="hidden md:table-cell">
														<span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
															Active
														</span>
													</TableCell>
													<TableCell className="text-xs text-gray-500 hidden lg:table-cell">Recently</TableCell>
													<TableCell>
														<Button 
															size="sm" 
															variant="outline"
															onClick={() => router.push(`/admin/users?edit=${admin._id}`)}
															className="text-xs"
														>
															Edit
														</Button>
													</TableCell>
												</TableRow>
											)) : null}
											{Array.isArray(admins) && admins.length > 5 && (
												<TableRow>
													<TableCell colSpan={6} className="text-center py-4">														<Button 
															variant="ghost" 
															onClick={() => router.push('/admin/users?filter=admin')}
															className="text-xs sm:text-sm"
														>
															View all {Array.isArray(admins) ? admins.length : 0} admin users →
														</Button>
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
								)}
							</CardContent>
						</Card>					)}
				</div>
			</main>
		</div>
	);
}
