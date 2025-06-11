"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table"
import { BarChart, Users, ShoppingCart, Package, Truck, CreditCard, Settings, LineChart, Megaphone, UserCog } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminProducts from "./products/page"

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
	const [tab, setTab] = useState("overview")
	const [products, setProducts] = useState<Product[]>([])
	const [orders, setOrders] = useState<Order[]>([])
	const [users, setUsers] = useState<User[]>([])
	const [admins, setAdmins] = useState<User[]>([])
	const [payments, setPayments] = useState<any[]>([])
	const [shipping, setShipping] = useState<any[]>([])
	const [marketing, setMarketing] = useState<any[]>([])
	const [analytics, setAnalytics] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	const [newPayment, setNewPayment] = useState({ amount: "", status: "" })
	const [editingPayment, setEditingPayment] = useState<any | null>(null)
	const [newShipping, setNewShipping] = useState({ carrier: "", status: "" })
	const [editingShipping, setEditingShipping] = useState<any | null>(null)
	const [newMarketing, setNewMarketing] = useState({ campaign: "", status: "" })
	const [editingMarketing, setEditingMarketing] = useState<any | null>(null)
	const [newAnalytics, setNewAnalytics] = useState({ metric: "", value: "" })
	const [editingAnalytics, setEditingAnalytics] = useState<any | null>(null)
	const { toast } = useToast()

	useEffect(() => {
		setLoading(true)
		Promise.all([
			fetch("/api/products").then((res) => res.json()),
			fetch("/api/orders").then((res) => res.json()),
			fetch("/api/users").then((res) => res.json()),
			fetch("/api/admin-users").then((res) => res.json()),
			fetch("/api/payments").then((res) => res.json()),
			fetch("/api/shipping").then((res) => res.json()),
			fetch("/api/marketing").then((res) => res.json()),
			fetch("/api/analytics").then((res) => res.json()),
		])
			.then(
				([
					products,
					orders,
					users,
					admins,
					payments,
					shipping,
					marketing,
					analytics,
				]) => {
					setProducts(products)
					setOrders(orders)
					setUsers(users)
					setAdmins(admins)
					setPayments(payments)
					setShipping(shipping)
					setMarketing(marketing)
					setAnalytics(analytics)
					setError("")
				}
			)
			.catch(() => setError("Failed to load dashboard data"))
			.finally(() => setLoading(false))
	}, [])

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
		}
	}
	// --- Marketing CRUD handlers ---
	async function fetchMarketing() {
		const res = await fetch("/api/marketing")
		const data = await res.json()
		setMarketing(data)
	}
	async function handleAddMarketing() {
		try {
			await fetch("/api/marketing", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newMarketing),
			})
			setNewMarketing({ campaign: "", status: "" })
			toast({ title: "Marketing added", description: "Marketing entry was added successfully." })
			await fetchMarketing()
		} catch {
			toast({ title: "Error", description: "Failed to add marketing entry.", variant: "destructive" })
		}
	}
	async function handleEditMarketing() {
		try {
			await fetch(`/api/marketing?id=${editingMarketing._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editingMarketing),
			})
			setEditingMarketing(null)
			toast({ title: "Marketing updated", description: "Marketing entry was updated successfully." })
			await fetchMarketing()
		} catch {
			toast({ title: "Error", description: "Failed to update marketing entry.", variant: "destructive" })
		}
	}
	async function handleDeleteMarketing(id: string) {
		try {
			await fetch(`/api/marketing?id=${id}`, { method: "DELETE" })
			toast({ title: "Marketing deleted", description: "Marketing entry was deleted successfully." })
			await fetchMarketing()
		} catch {
			toast({ title: "Error", description: "Failed to delete marketing entry.", variant: "destructive" })
		}
	}
	// --- Analytics CRUD handlers ---
	async function fetchAnalytics() {
		const res = await fetch("/api/analytics")
		const data = await res.json()
		setAnalytics(data)
	}
	async function handleAddAnalytics() {
		try {
			await fetch("/api/analytics", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newAnalytics),
			})
			setNewAnalytics({ metric: "", value: "" })
			toast({ title: "Analytics added", description: "Analytics entry was added successfully." })
			await fetchAnalytics()
		} catch {
			toast({ title: "Error", description: "Failed to add analytics entry.", variant: "destructive" })
		}
	}
	async function handleEditAnalytics() {
		try {
			await fetch(`/api/analytics?id=${editingAnalytics._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editingAnalytics),
			})
			setEditingAnalytics(null)
			toast({ title: "Analytics updated", description: "Analytics entry was updated successfully." })
			await fetchAnalytics()
		} catch {
			toast({ title: "Error", description: "Failed to update analytics entry.", variant: "destructive" })
		}
	}
	async function handleDeleteAnalytics(id: string) {
		try {
			await fetch(`/api/analytics?id=${id}`, { method: "DELETE" })
			toast({ title: "Analytics deleted", description: "Analytics entry was deleted successfully." })
			await fetchAnalytics()
		} catch {
			toast({ title: "Error", description: "Failed to delete analytics entry.", variant: "destructive" })
		}
	}

	return (
		<div className="flex min-h-screen">
			<Tabs defaultValue="overview" orientation="vertical" className="flex w-full">
				{/* Sidebar Navigation - Improved for scrollability */}
				<aside className="w-64 h-screen min-h-0 bg-gray-900 text-white flex flex-col">
					<div className="sticky top-0 z-10 bg-gray-900">
						<h1 className="text-2xl font-bold px-4 pt-6 pb-3">Admin Dashboard</h1>
					</div>
					<nav className="flex-1 min-h-0 overflow-y-auto px-2 pb-6">
						<TabsList className="flex flex-col gap-1 bg-transparent pt-44">
							{/* Explicitly set background and text color for triggers to ensure visibility */}
							<TabsTrigger value="overview" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><BarChart className="inline w-4 h-4 mr-2" />Overview</TabsTrigger>
							<TabsTrigger value="products" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><Package className="inline w-4 h-4 mr-2" />Products</TabsTrigger>
							<TabsTrigger value="orders" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><ShoppingCart className="inline w-4 h-4 mr-2" />Orders</TabsTrigger>
							<TabsTrigger value="users" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><Users className="inline w-4 h-4 mr-2" />Users</TabsTrigger>
							<TabsTrigger value="admins" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><UserCog className="inline w-4 h-4 mr-2" />Admins</TabsTrigger>
							<TabsTrigger value="payments" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><CreditCard className="inline w-4 h-4 mr-2" />Payments</TabsTrigger>
							<TabsTrigger value="shippings" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><Truck className="inline w-4 h-4 mr-2" />Shipping</TabsTrigger>
							<TabsTrigger value="marketing" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><Megaphone className="inline w-4 h-4 mr-2" />Marketing</TabsTrigger>
							<TabsTrigger value="analytics" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><LineChart className="inline w-4 h-4 mr-2" />Analytics</TabsTrigger>
							<TabsTrigger value="settings" className="justify-start bg-transparent text-white hover:bg-gray-800 data-[state=active]:bg-gray-800 data-[state=active]:text-white"><Settings className="inline w-4 h-4 mr-2" />Settings</TabsTrigger>
						</TabsList>
					</nav>
				</aside>
				{/* Main Content - Reverted State */}
				<main className="flex-1 p-8 bg-gray-50 min-h-screen overflow-x-auto">
					<div className="max-w-7xl mx-auto">
						{/* Overview */}
						<TabsContent value="overview">
							<Card className="mb-6">
								<CardHeader>
									<CardTitle>Overview</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
										<div className="bg-white p-4 rounded shadow"><div className="text-sm">Total Sales</div><div className="text-2xl font-bold">KSh 1,200,000</div></div>
										<div className="bg-white p-4 rounded shadow"><div className="text-sm">Orders</div><div className="text-2xl font-bold">2,340</div></div>
										<div className="bg-white p-4 rounded shadow"><div className="text-sm">Users</div><div className="text-2xl font-bold">1,120</div></div>
										<div className="bg-white p-4 rounded shadow"><div className="text-sm">Revenue</div><div className="text-2xl font-bold">KSh 900,000</div></div>
									</div>
									<div className="bg-white p-6 rounded shadow mb-4">[Sales/Orders Chart Placeholder]</div>
									<div className="flex gap-4">
										<div className="bg-white p-4 rounded shadow flex-1">Low Stock Alerts: 3</div>
										<div className="bg-white p-4 rounded shadow flex-1">Pending Orders: 12</div>
										<div className="bg-white p-4 rounded shadow flex-1">New Users: 5</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
						{/* Products */}
						<TabsContent value="products">
							<AdminProducts />
						</TabsContent>
						{/* Orders */}
						<TabsContent value="orders">
							<Card>
								<CardHeader><CardTitle>Orders</CardTitle></CardHeader>
								<CardContent>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Order ID</TableCell>
												<TableCell>Customer</TableCell>
												<TableCell>Date</TableCell>
												<TableCell>Status</TableCell>
												<TableCell>Total</TableCell>
												<TableCell>Actions</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell>#1001</TableCell>
												<TableCell>Jane Doe</TableCell>
												<TableCell>2025-06-10</TableCell>
												<TableCell>Pending</TableCell>
												<TableCell>KSh 5,000</TableCell>
												<TableCell><Button size="sm">View</Button></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
						{/* Users */}
						<TabsContent value="users">
							<Card>
								<CardHeader><CardTitle>Users</CardTitle></CardHeader>
								<CardContent>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Name</TableCell>
												<TableCell>Email</TableCell>
												<TableCell>Role</TableCell>
												<TableCell>Registered</TableCell>
												<TableCell>Status</TableCell>
												<TableCell>Actions</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell>John Smith</TableCell>
												<TableCell>john@email.com</TableCell>
												<TableCell>User</TableCell>
												<TableCell>2025-05-01</TableCell>
												<TableCell>Active</TableCell>
												<TableCell><Button size="sm">Edit</Button></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
						{/* Admins */}
						<TabsContent value="admins">
							<Card>
								<CardHeader><CardTitle>Admins</CardTitle></CardHeader>
								<CardContent>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Name</TableCell>
												<TableCell>Email</TableCell>
												<TableCell>Role</TableCell>
												<TableCell>Last Login</TableCell>
												<TableCell>Actions</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell>Admin Jane</TableCell>
												<TableCell>admin@email.com</TableCell>
												<TableCell>Super Admin</TableCell>
												<TableCell>2025-06-10</TableCell>
												<TableCell><Button size="sm">Edit</Button></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
						{/* Payments */}
						<TabsContent value="payments">
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
											<TableRow>
												<TableCell>PMT-001</TableCell>
												<TableCell>#1001</TableCell>
												<TableCell>Jane Doe</TableCell>
												<TableCell>KSh 5,000</TableCell>
												<TableCell>Mpesa</TableCell>
												<TableCell>Success</TableCell>
												<TableCell>2025-06-10</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
						{/* Shippings */}
						<TabsContent value="shippings"> {/* Note: Tab value is "shippings" to match Trigger */}
							<Card>
								<CardHeader><CardTitle>Shipping</CardTitle></CardHeader> {/* Title is "Shipping" */}
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
											<TableRow>
												<TableCell>#1001</TableCell>
												<TableCell>Jane Doe</TableCell>
												<TableCell>123 Main St</TableCell>
												<TableCell>Standard</TableCell>
												<TableCell>Shipped</TableCell>
												<TableCell>TRK12345</TableCell>
												<TableCell><Button size="sm">Update</Button></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
						{/* Marketing */}
						<TabsContent value="marketing">
							<Card>
								<CardHeader><CardTitle>Marketing</CardTitle></CardHeader>
								<CardContent>
									<div className="mb-4">[Campaigns List Placeholder]</div>
									<div className="mb-4">[Stats: Open/Click Rates, Coupon Usage, ROI]</div>
									<Button>Create Campaign</Button>
								</CardContent>
							</Card>
						</TabsContent>
						{/* Analytics */}
						<TabsContent value="analytics">
							<Card>
								<CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
								<CardContent>
									<div className="mb-4">[Sales Chart Placeholder]</div>
									<div className="mb-4">[Traffic Chart Placeholder]</div>
									<div className="mb-4">[Top Products, Top Customers]</div>
								</CardContent>
							</Card>
						</TabsContent>
						{/* Settings */}
						<TabsContent value="settings">
							<Card>
								<CardHeader><CardTitle>Settings</CardTitle></CardHeader>
								<CardContent>
									<p>Manage your application settings here.</p>
									{/* Add settings form or options here */}
								</CardContent>
							</Card>
						</TabsContent>
					</div>
				</main>
			</Tabs>
		</div>
	);
}
