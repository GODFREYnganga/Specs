"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
		return (		<html lang="en" suppressHydrationWarning>
			<head>
				<title>Admin Dashboard - Loading</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body>
				<div className="flex items-center justify-center min-h-screen p-4">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<span className="text-sm sm:text-lg font-semibold">Loading...</span>
					</div>
				</div>
			</body>
		</html>
		)
	}

	if (!isAdmin) {
		return (		<html lang="en" suppressHydrationWarning>
			<head>
				<title>Admin Login</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					<AuthProvider>
						<div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
							{children}
						</div>
						<Toaster />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
		)
	}

	// Only render the main dashboard content with clean layout (no navbar/footer)
	return (		<html lang="en" suppressHydrationWarning>
			<head>
				<title>Admin Dashboard - Spectacles Ecommerce</title>
				<meta name="description" content="Admin Dashboard for Spectacles Ecommerce" />
				<meta name="robots" content="noindex, nofollow" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					<AuthProvider>
						<div className="min-h-screen bg-background text-foreground">
							<div className="w-full h-full">
								<main className="px-2 py-2 sm:px-4 sm:py-4">
									{children}
								</main>
							</div>
						</div>
						<Toaster />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
