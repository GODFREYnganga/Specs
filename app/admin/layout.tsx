"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const sidebarLinks = [
	{ href: "/admin", label: "Overview" },
	{ href: "/admin/products", label: "Products" },
	{ href: "/admin/orders", label: "Orders" },
	{ href: "/admin/users", label: "Users" },
	{ href: "/admin/payments", label: "Payments" },
	{ href: "/admin/shipping", label: "Shipping" },
	{ href: "/admin/marketing", label: "Marketing" },
	{ href: "/admin/analytics", label: "Analytics" },
	{ href: "/admin/settings", label: "Settings" },
]

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [loading, setLoading] = useState(true)
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		async function checkAdmin() {
			try {
				const res = await fetch("/api/users/me")
				if (!res.ok) {
					setIsAdmin(false)
					setLoading(false)
					router.replace("/admin/login")
					return
				}
				const user = await res.json()
				if (user.role !== "admin") {
					setIsAdmin(false)
					setLoading(false)
					router.replace("/admin/login")
					return
				}
				setIsAdmin(true)
			} catch {
				setIsAdmin(false)
				router.replace("/admin/login")
			} finally {
				setLoading(false)
			}
		}
		checkAdmin()
	}, [router])

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<span className="text-lg font-semibold">Loading...</span>
			</div>
		)
	}
	// Only render dashboard layout if authenticated as admin
	if (!isAdmin) return null

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
			{/* Sidebar */}
			<aside className={`fixed md:static z-30 top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg md:shadow-none transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>
				<div className="flex items-center justify-between md:justify-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
					<span className="text-xl font-bold tracking-tight">Admin</span>
					<Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
						×
					</Button>
				</div>
				<nav className="flex-1 flex flex-col gap-1 px-4 py-6">
					{sidebarLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="rounded px-3 py-2 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
							onClick={() => setSidebarOpen(false)}
						>
							{link.label}
						</Link>
					))}
				</nav>
			</aside>
			{/* Mobile sidebar toggle */}
			<Button
				variant="ghost"
				size="icon"
				className="fixed top-4 left-4 z-40 md:hidden"
				onClick={() => setSidebarOpen(true)}
				aria-label="Open sidebar"
			>
				<Menu className="h-6 w-6" />
			</Button>
			{/* Main content */}
			<main className="flex-1 min-h-screen md:ml-64 p-4 md:p-8 bg-background">
				<div className="max-w-5xl mx-auto">
					<Card className="p-4 md:p-8 shadow-md bg-white dark:bg-gray-900">
						{children}
					</Card>
				</div>
			</main>
		</div>
	)
}
