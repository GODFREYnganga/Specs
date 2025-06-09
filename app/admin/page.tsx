"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
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
		<div className="p-4 bg-background min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
			<div className="flex flex-col md:flex-row gap-6">
				{/* Sidebar */}
				<aside className="w-full md:w-60 flex-shrink-0 mb-4 md:mb-0">
					<nav className="bg-card rounded-lg shadow p-2 md:p-4 flex md:flex-col flex-row gap-2 md:gap-1">
						{SIDEBAR_ITEMS.map((item) => (
							<button
								key={item.key}
								className={`w-full text-left px-4 py-2 rounded transition font-medium text-base md:text-sm ${
									tab === item.key
										? "bg-primary text-white"
										: "hover:bg-muted text-muted-foreground"
								}`}
								onClick={() => setTab(item.key)}
							>
								{item.label}
							</button>
						))}
					</nav>
				</aside>
				{/* Main Content */}
				<main className="flex-1">
					{/* Overview */}
					{tab === "overview" && (
						loading ? (
							<div>Loading...</div>
						) : error ? (
							<div className="text-red-500">{error}</div>
						) : (
							<>
								<div className="flex flex-col gap-4 mb-6">
									<Card>
										<CardContent className="p-4">
											<h2 className="text-sm font-medium text-muted-foreground">
												Total Orders
											</h2>
											<p className="text-2xl font-bold">
												{orders.length}
											</p>
										</CardContent>
									</Card>
									<Card>
										<CardContent className="p-4">
											<h2 className="text-sm font-medium text-muted-foreground">
												Revenue
											</h2>
											<p className="text-2xl font-bold">
												KSh{" "}
												{orders
													.reduce(
														(sum, o) => sum + (o.total || 0),
														0
													)
													.toLocaleString()}
											</p>
										</CardContent>
									</Card>
									<Card>
										<CardContent className="p-4">
											<h2 className="text-sm font-medium text-muted-foreground">
												New Customers
											</h2>
											<p className="text-2xl font-bold">
												{users.length}
											</p>
										</CardContent>
									</Card>
									<Card>
										<CardContent className="p-4">
											<h2 className="text-sm font-medium text-muted-foreground">
												Top Product
											</h2>
											<p className="text-2xl font-bold">
												{products[0]?.name || "-"}
											</p>
										</CardContent>
									</Card>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
									<Card>
										<CardContent className="p-4">
											<h3 className="text-lg font-semibold mb-4">
												Sales Trends
											</h3>
											<ResponsiveContainer width="100%" height={200}>
												<BarChart data={salesData}>
													<XAxis dataKey="name" />
													<YAxis />
													<Tooltip />
													<Bar
														dataKey="sales"
														fill="#4f46e5"
														radius={[4, 4, 0, 0]}
													/>
												</BarChart>
											</ResponsiveContainer>
										</CardContent>
									</Card>
									<Card>
										<CardContent className="p-4">
											<h3 className="text-lg font-semibold mb-4">
												Low Stock Alerts
											</h3>
											<ul className="text-sm text-destructive space-y-1">
												{products
													.filter(
														(p) => p.inStock && p.inStock < 5
													)
													.map((p) => (
														<li key={p._id}>
															{p.name} ({p.inStock} left)
														</li>
													))}
											</ul>
										</CardContent>
									</Card>
								</div>
								<div className="flex gap-4 mb-4">
									<Button
										className="bg-primary text-white"
										onClick={() =>
											(window.location.href = "/admin/products/new")
										}
									>
										Add Product
									</Button>
									<Button
										className="bg-primary text-white"
										onClick={() =>
											(window.location.href = "/admin/orders")
										}
									>
										View Orders
									</Button>
								</div>
							</>
						)
					)}
					{/* Products */}
					{tab === "products" && (
						<Card>
							<CardContent className="p-4">
								<h3 className="text-lg font-semibold mb-4">
									Manage Products
								</h3>
								<Button
									className="mb-4 bg-primary text-white"
									onClick={() =>
										(window.location.href = "/admin/products/new")
									}
								>
									Add Product
								</Button>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Price</TableHead>
											<TableHead>Stock</TableHead>
											<TableHead>Category</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{products.map((product) => (
											<TableRow key={product._id}>
												<TableCell>{product.name}</TableCell>
												<TableCell>KSh {product.price}</TableCell>
												<TableCell>
													{product.inStock ? product.inStock : 0}
												</TableCell>
												<TableCell>{product.category}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
					{/* Orders */}
					{tab === "orders" && (
						<Card>
							<CardContent className="p-4">
								<h3 className="text-lg font-semibold mb-4">Orders</h3>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>User</TableHead>
											<TableHead>Total</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{orders.map((order) => (
											<TableRow key={order._id}>
												<TableCell>{order._id}</TableCell>
												<TableCell>{order.user || "-"}</TableCell>
												<TableCell>KSh {order.total}</TableCell>
												<TableCell>{order.status}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
					{/* Users */}
					{tab === "users" && (
						<Card>
							<CardContent className="p-4">
								<h3 className="text-lg font-semibold mb-4">Users</h3>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Role</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{users.map((user) => (
											<TableRow key={user._id}>
												<TableCell>
													{user.firstName} {user.lastName}
												</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>{user.role || "User"}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
					{/* Admins */}
					{tab === "admins" && (
						<Card>
							<CardContent className="p-4">
								<h3 className="text-lg font-semibold mb-4">Admins</h3>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Role</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{admins.map((admin) => (
											<TableRow key={admin._id}>
												<TableCell>
													{admin.firstName} {admin.lastName}
												</TableCell>
												<TableCell>{admin.email}</TableCell>
												<TableCell>{admin.role || "Admin"}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
					{/* Payments */}
					{tab === "payments" && (
						<Card>
							<CardContent className="p-4">
								<h3 className="text-lg font-semibold mb-4">Payments</h3>
								<form className="flex gap-2 mb-4" onSubmit={e => { e.preventDefault(); handleAddPayment() }}>
									<input
										className="border rounded px-2 py-1"
										placeholder="Amount"
										value={newPayment.amount}
										onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
									/>
									<input
										className="border rounded px-2 py-1"
										placeholder="Status"
										value={newPayment.status}
										onChange={e => setNewPayment({ ...newPayment, status: e.target.value })}
									/>
									<Button type="submit">Add</Button>
								</form>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Amount</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{payments.map((payment) => (
											editingPayment && editingPayment._id === payment._id ? (
												<TableRow key={payment._id}>
													<TableCell>{payment._id}</TableCell>
													<TableCell>
														<input
															className="border rounded px-2 py-1"
															value={editingPayment.amount}
															onChange={e => setEditingPayment({ ...editingPayment, amount: e.target.value })}
														/>
													</TableCell>
													<TableCell>
														<input
															className="border rounded px-2 py-1"
															value={editingPayment.status}
															onChange={e => setEditingPayment({ ...editingPayment, status: e.target.value })}
														/>
													</TableCell>
													<TableCell>
														<Button size="sm" onClick={handleEditPayment}>Save</Button>
														<Button size="sm" variant="outline" onClick={() => setEditingPayment(null)}>Cancel</Button>
													</TableCell>
												</TableRow>
											) : (
												<TableRow key={payment._id}>
													<TableCell>{payment._id}</TableCell>
													<TableCell>{payment.amount}</TableCell>
													<TableCell>{payment.status}</TableCell>
													<TableCell>
														<Button size="sm" variant="outline" onClick={() => setEditingPayment(payment)}>Edit</Button>
														<Button size="sm" variant="destructive" onClick={() => handleDeletePayment(payment._id)}>Delete</Button>
													</TableCell>
												</TableRow>
											)
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
					{/* Shipping */}
					{tab === "shipping" && (
						<Card>
							<CardContent className="p-4">
								<h3 className="text-lg font-semibold mb-4">Shipping</h3>
								<form className="flex gap-2 mb-4" onSubmit={e => { e.preventDefault(); handleAddShipping() }}>
									<input
										className="border rounded px-2 py-1"
										placeholder="Carrier"
										value={newShipping.carrier}
										onChange={e => setNewShipping({ ...newShipping, carrier: e.target.value })}
									/>
									<input
										className="border rounded px-2 py-1"
										placeholder="Status"
										value={newShipping.status}
										onChange={e => setNewShipping({ ...newShipping, status: e.target.value })}
									/>
									<Button type="submit">Add</Button>
								</form>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Carrier</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{shipping.map((ship) => (
											editingShipping && editingShipping._id === ship._id ? (
												<TableRow key={ship._id}>
													<TableCell>{ship._id}</TableCell>
													<TableCell>
														<input
															className="border rounded px-2 py-1"
															value={editingShipping.carrier}
															onChange={e => setEditingShipping({ ...editingShipping, carrier: e.target.value })}
														/>
													</TableCell>
													<TableCell>
														<input
															className="border rounded px-2 py-1"
															value={editingShipping.status}
															onChange={e => setEditingShipping({ ...editingShipping, status: e.target.value })}
														/>
													</TableCell>
													<TableCell>
														<Button size="sm" onClick={handleEditShipping}>Save</Button>
														<Button size="sm" variant="outline" onClick={() => setEditingShipping(null)}>Cancel</Button>
													</TableCell>
												</TableRow>
											) : (
												<TableRow key={ship._id}>
													<TableCell>{ship._id}</TableCell>
													<TableCell>{ship.carrier}</TableCell>
													<TableCell>{ship.status}</TableCell>
													<TableCell>
														<Button size="sm" variant="outline" onClick={() => setEditingShipping(ship)}>Edit</Button>
														<Button size="sm" variant="destructive" onClick={() => handleDeleteShipping(ship._id)}>Delete</Button>
													</TableCell>
												</TableRow>
											)
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
					{/* Marketing */}
					{tab === "marketing" && (
						<Card>
							<CardContent className="p-4">
								<h3 className="text-lg font-semibold mb-4">Marketing</h3>
								<form className="flex gap-2 mb-4" onSubmit={e => { e.preventDefault(); handleAddMarketing() }}>
									<input
										className="border rounded px-2 py-1"
										placeholder="Campaign"
										value={newMarketing.campaign}
										onChange={e => setNewMarketing({ ...newMarketing, campaign: e.target.value })}
									/>
									<input
										className="border rounded px-2 py-1"
										placeholder="Status"
										value={newMarketing.status}
										onChange={e => setNewMarketing({ ...newMarketing, status: e.target.value })}
									/>
									<Button type="submit">Add</Button>
								</form>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Campaign</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{marketing.map((mkt) => (
											editingMarketing && editingMarketing._id === mkt._id ? (
												<TableRow key={mkt._id}>
													<TableCell>{mkt._id}</TableCell>
													<TableCell>
														<input
															className="border rounded px-2 py-1"
															value={editingMarketing.campaign}
															onChange={e => setEditingMarketing({ ...editingMarketing, campaign: e.target.value })}
														/>
													</TableCell>
													<TableCell>
														<input
															className="border rounded px-2 py-1"
															value={editingMarketing.status}
															onChange={e => setEditingMarketing({ ...editingMarketing, status: e.target.value })}
														/>
													</TableCell>
													<TableCell>
														<Button size="sm" onClick={handleEditMarketing}>Save</Button>
														<Button size="sm" variant="outline" onClick={() => setEditingMarketing(null)}>Cancel</Button>
													</TableCell>
												</TableRow>
											) : (
												<TableRow key={mkt._id}>
													<TableCell>{mkt._id}</TableCell>
													<TableCell>{mkt.campaign}</TableCell>
													<TableCell>{mkt.status}</TableCell>
													<TableCell>
														<Button size="sm" variant="outline" onClick={() => setEditingMarketing(mkt)}>Edit</Button>
														<Button size="sm" variant="destructive" onClick={() => handleDeleteMarketing(mkt._id)}>Delete</Button>
													</TableCell>
												</TableRow>
											)
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
					{/* Analytics */}
					{tab === "analytics" && (
						<Card>
							<CardContent className="p-4">
								<h3 className="text-lg font-semibold mb-4">Analytics</h3>
								<form className="flex gap-2 mb-4" onSubmit={e => { e.preventDefault(); handleAddAnalytics() }}>
									<input
										className="border rounded px-2 py-1"
										placeholder="Metric"
										value={newAnalytics.metric}
										onChange={e => setNewAnalytics({ ...newAnalytics, metric: e.target.value })}
									/>
									<input
										className="border rounded px-2 py-1"
										placeholder="Value"
										value={newAnalytics.value}
										onChange={e => setNewAnalytics({ ...newAnalytics, value: e.target.value })}
									/>
									<Button type="submit">Add</Button>
								</form>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Metric</TableHead>
											<TableHead>Value</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{analytics.map((ana) => (
											editingAnalytics && editingAnalytics._id === ana._id ? (
												<TableRow key={ana._id}>
													<TableCell>{ana._id}</TableCell>
													<TableCell>
														<input
															className="border rounded px-2 py-1"
															value={editingAnalytics.metric}
															onChange={e => setEditingAnalytics({ ...editingAnalytics, metric: e.target.value })}
														/>
													</TableCell>
													<TableCell>
														<input
															className="border rounded px-2 py-1"
															value={editingAnalytics.value}
															onChange={e => setEditingAnalytics({ ...editingAnalytics, value: e.target.value })}
														/>
													</TableCell>
													<TableCell>
														<Button size="sm" onClick={handleEditAnalytics}>Save</Button>
														<Button size="sm" variant="outline" onClick={() => setEditingAnalytics(null)}>Cancel</Button>
													</TableCell>
												</TableRow>
											) : (
												<TableRow key={ana._id}>
													<TableCell>{ana._id}</TableCell>
													<TableCell>{ana.metric}</TableCell>
													<TableCell>{ana.value}</TableCell>
													<TableCell>
														<Button size="sm" variant="outline" onClick={() => setEditingAnalytics(ana)}>Edit</Button>
														<Button size="sm" variant="destructive" onClick={() => handleDeleteAnalytics(ana._id)}>Delete</Button>
													</TableCell>
												</TableRow>
											)
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
					{/* Settings */}
					{tab === "settings" && (
						<Card>
							<CardContent className="p-4">
								<h3 className="text-lg font-semibold mb-4">Settings</h3>
								<div className="text-muted-foreground">
									Store settings coming soon.
								</div>
							</CardContent>
						</Card>
					)}
				</main>
			</div>
		</div>
	)
}
