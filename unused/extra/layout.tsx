"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"

export default function ExtraAdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		async function checkAdmin() {
			try {
				const res = await fetch("/api/users/me")
				if (!res.ok) {
					setIsAdmin(false)
					setLoading(false)
					router.replace("/extra/login")
					return
				}
				const user = await res.json()
				if (user.role !== "admin") {
					setIsAdmin(false)
					setLoading(false)
					router.replace("/extra/login")
					return
				}
				setIsAdmin(true)
			} catch {
				setIsAdmin(false)
				router.replace("/extra/login")
			} finally {
				setLoading(false)
			}
		}
		checkAdmin()
	}, [router])

	if (loading) {
		return (
			<html lang="en" suppressHydrationWarning>
				<head>
					<title>Extra Admin Dashboard - Loading</title>
				</head>
				<body>
					<div className="flex items-center justify-center min-h-screen">
						<span className="text-lg font-semibold">Loading Extra Admin...</span>
					</div>
				</body>
			</html>
		)
	}

	if (!isAdmin) {
		return null
	}

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<title>Extra Admin Dashboard</title>
			</head>
			<body>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					<AuthProvider>
						{children}
						<Toaster />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
