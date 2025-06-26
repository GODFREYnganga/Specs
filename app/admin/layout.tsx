"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

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
	if (!isAdmin) {
		// Only render children (which will be the login page) if not admin
		return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">{children}</div>;
	}	// Only render the main dashboard content with clean layout (no navbar/footer)
	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="w-full h-full">
				<main className="px-4 py-4">
					{children}
				</main>
			</div>
		</div>
	)
}
