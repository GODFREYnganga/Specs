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
	{ key: "bulk-upload", label: "Bulk Upload" }, // Added bulk upload tab
]

export default function ExtraAdminDashboard() {
	const router = useRouter()
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

	const handleManualRefresh = () => {
		loadDashboardData(true)
		toast({
			title: "Data refreshed",
			description: "Dashboard data has been updated",
		})
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<span className="text-lg font-semibold">Loading Extra Admin Dashboard...</span>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
					<Button onClick={() => loadDashboardData(true)}>Retry</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Sidebar */}
			<div className="w-64 bg-white shadow-lg">
				<div className="p-6">
					<h1 className="text-2xl font-bold text-gray-900">Extra Admin</h1>
					<p className="text-sm text-gray-600">Duplicate Dashboard</p>
				</div>
				<nav className="mt-6">
					{SIDEBAR_ITEMS.map((item) => (
						<button
							key={item.key}
							onClick={() => setTab(item.key)}
							className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
								tab === item.key ? "bg-blue-50 border-r-2 border-blue-500 text-blue-600" : "text-gray-700"
							}`}
						>
							{item.key === "overview" && <BarChart className="w-5 h-5 mr-3" />}
							{item.key === "products" && <Package className="w-5 h-5 mr-3" />}
							{item.key === "inventory" && <Package className="w-5 h-5 mr-3" />}
							{item.key === "orders" && <ShoppingCart className="w-5 h-5 mr-3" />}
							{item.key === "users" && <Users className="w-5 h-5 mr-3" />}
							{item.key === "admins" && <UserCog className="w-5 h-5 mr-3" />}
							{item.key === "payments" && <CreditCard className="w-5 h-5 mr-3" />}
							{item.key === "shipping" && <Truck className="w-5 h-5 mr-3" />}
							{item.key === "marketing" && <Megaphone className="w-5 h-5 mr-3" />}
							{item.key === "analytics" && <LineChart className="w-5 h-5 mr-3" />}
							{item.key === "settings" && <Settings className="w-5 h-5 mr-3" />}
							{item.key === "bulk-upload" && <Package className="w-5 h-5 mr-3" />}
							{item.label}
						</button>
					))}
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 overflow-auto">
				<div className="p-8">
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-3xl font-bold text-gray-900">
								{SIDEBAR_ITEMS.find(item => item.key === tab)?.label || "Dashboard"}
							</h2>
							{lastUpdated && (
								<p className="text-sm text-gray-600 mt-1">
									<Clock className="w-4 h-4 inline mr-1" />
									Last updated: {lastUpdated.toLocaleTimeString()}
								</p>
							)}
						</div>
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setAutoRefresh(!autoRefresh)}
							>
								{autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleManualRefresh}
							>
								<RefreshCw className="w-4 h-4 mr-2" />
								Refresh
							</Button>
						</div>
					</div>

					{/* Content based on selected tab */}
					{tab === "overview" && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total Products</CardTitle>
									<Package className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{products.length}</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
									<ShoppingCart className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{orders.length}</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total Users</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{users.length}</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total Admins</CardTitle>
									<UserCog className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{admins.length}</div>
								</CardContent>
							</Card>
						</div>
					)}

					{tab === "bulk-upload" && (
						<BulkUploadComponent />
					)}

					{tab === "products" && (
						<div className="bg-white rounded-lg shadow">
							<div className="p-6">
								<h3 className="text-lg font-semibold mb-4">Products</h3>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Name</TableCell>
											<TableCell>Price</TableCell>
											<TableCell>Category</TableCell>
											<TableCell>Stock</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{products.slice(0, 10).map((product) => (
											<TableRow key={product._id}>
												<TableCell>{product.name}</TableCell>
												<TableCell>KSh {product.price}</TableCell>
												<TableCell>{product.category}</TableCell>
												<TableCell>{product.inStock || 0}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
					)}

					{/* Add other tab content as needed */}
				</div>
			</div>
		</div>
	)
}

// Bulk Upload Component
function BulkUploadComponent() {
	const [file, setFile] = useState<File | null>(null)
	const [uploading, setUploading] = useState(false)
	const [previewData, setPreviewData] = useState<any[]>([])
	const [showPreview, setShowPreview] = useState(false)
	const { toast } = useToast()

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0]
		if (selectedFile) {
			setFile(selectedFile)
			setShowPreview(false)
			setPreviewData([])
		}
	}

	const handlePreview = async () => {
		if (!file) return

		const formData = new FormData()
		formData.append('file', file)

		try {
			setUploading(true)
			const response = await fetch('/api/extra/bulk-upload/preview', {
				method: 'POST',
				body: formData,
			})

			if (response.ok) {
				const data = await response.json()
				setPreviewData(data.preview)
				setShowPreview(true)
			} else {
				toast({
					title: "Error",
					description: "Failed to preview file",
					variant: "destructive",
				})
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to preview file",
				variant: "destructive",
			})
		} finally {
			setUploading(false)
		}
	}

	const handleUpload = async () => {
		if (!file) return

		const formData = new FormData()
		formData.append('file', file)

		try {
			setUploading(true)
			const response = await fetch('/api/extra/bulk-upload/process', {
				method: 'POST',
				body: formData,
			})

			if (response.ok) {
				const data = await response.json()
				toast({
					title: "Success",
					description: `${data.processed} products uploaded successfully`,
				})
				setFile(null)
				setShowPreview(false)
				setPreviewData([])
			} else {
				const error = await response.json()
				toast({
					title: "Error",
					description: error.message || "Failed to upload products",
					variant: "destructive",
				})
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to upload products",
				variant: "destructive",
			})
		} finally {
			setUploading(false)
		}
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Bulk Product Upload</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							Select Excel File
						</label>
						<input
							type="file"
							accept=".xlsx,.xls"
							onChange={handleFileChange}
							className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
					</div>

					<div className="flex gap-4">
						<Button
							onClick={handlePreview}
							disabled={!file || uploading}
							variant="outline"
						>
							{uploading ? "Loading..." : "Preview Data"}
						</Button>
						<Button
							onClick={handleUpload}
							disabled={!file || uploading || !showPreview}
						>
							{uploading ? "Uploading..." : "Upload Products"}
						</Button>
					</div>
				</CardContent>
			</Card>

			{showPreview && previewData.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Data Preview</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Price</TableCell>
										<TableCell>Category</TableCell>
										<TableCell>Description</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{previewData.slice(0, 5).map((item, index) => (
										<TableRow key={index}>
											<TableCell>{item.name}</TableCell>
											<TableCell>{item.price}</TableCell>
											<TableCell>{item.category}</TableCell>
											<TableCell>{item.description}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							{previewData.length > 5 && (
								<p className="text-sm text-gray-600 mt-2">
									Showing first 5 of {previewData.length} products
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
