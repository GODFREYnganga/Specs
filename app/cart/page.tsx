"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CartPage() {
	const router = useRouter()
	
	useEffect(() => {
		// Redirect to modern cart page
		router.replace('/cart/modern')
	}, [router])

	return (
		<div className="container px-4 md:px-6 py-8">
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		</div>
	)
}
