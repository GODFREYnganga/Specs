"use client"

import Link from "next/link"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
	const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart()
	const { toast } = useToast()
	const [isUpdating, setIsUpdating] = useState(false)

	const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
	const shipping = 0 // Free shipping
	const tax = subtotal * 0.07 // 7% tax
	const total = subtotal + shipping + tax

	const handleQuantityChange = async (itemId: string | number, color: string | undefined, newQuantity: number) => {
		if (newQuantity < 1) return
		
		setIsUpdating(true)
		try {
			await updateQuantity(itemId, color || '', newQuantity)
			toast({
				title: "Cart updated",
				description: "Item quantity has been updated successfully.",
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update quantity. Please try again.",
				variant: "destructive",
			})
		} finally {
			setIsUpdating(false)
		}
	}

	const handleRemoveItem = async (itemId: string | number, color?: string) => {
		setIsUpdating(true)
		try {
			await removeFromCart(itemId, color)
			toast({
				title: "Item removed",
				description: "Item has been removed from your cart.",
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to remove item. Please try again.",
				variant: "destructive",
			})
		} finally {
			setIsUpdating(false)
		}
	}

	const handleClearCart = async () => {
		if (confirm('Are you sure you want to clear your cart?')) {
			setIsUpdating(true)
			try {
				await clearCart()
				toast({
					title: "Cart cleared",
					description: "All items have been removed from your cart.",
				})
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to clear cart. Please try again.",
					variant: "destructive",
				})
			} finally {
				setIsUpdating(false)
			}
		}
	}

	if (loading) {
		return (
			<div className="container px-4 md:px-6 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
				</div>
			</div>
		)
	}

	return (
		<div className="container px-4 md:px-6 py-8">
			{/* Breadcrumb */}
			<Link href="/products" className="flex items-center gap-2 text-sm mb-6 hover:underline">
				<ArrowLeft className="h-4 w-4" />
				Continue Shopping
			</Link>

			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">Shopping Cart</h1>
				{cart.length > 0 && (
					<Badge variant="secondary" className="text-sm">
						{cart.length} {cart.length === 1 ? 'item' : 'items'}
					</Badge>
				)}
			</div>

			{cart.length > 0 ? (
				<div className="grid md:grid-cols-3 gap-8">
					<div className="md:col-span-2 space-y-4">
						{/* Cart Actions */}
						<div className="flex justify-between items-center">
							<p className="text-sm text-muted-foreground">
								Manage your cart items below
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={handleClearCart}
								disabled={isUpdating}
							>
								Clear Cart
							</Button>
						</div>

						{/* Cart Items Table */}
						<Card>
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[300px]">Product</TableHead>
											<TableHead className="text-center">Price</TableHead>
											<TableHead className="text-center">Quantity</TableHead>
											<TableHead className="text-center">Total</TableHead>
											<TableHead className="text-center">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{cart.map((item) => (
											<TableRow key={`${item.id}-${item.color || 'default'}`}>
												<TableCell>
													<div className="flex items-center gap-4">
														<div className="relative h-16 w-16 overflow-hidden rounded-lg border">
															<img
																src={item.image || "/placeholder.svg"}
																alt={item.name}
																className="h-full w-full object-cover"
															/>
														</div>
														<div className="space-y-1">
															<Link 
																href={`/products/${item.productId || item.id}`}
																className="font-medium hover:underline"
															>
																{item.name}
															</Link>
															{item.color && (
																<div className="flex items-center gap-2">
																	<span className="text-sm text-muted-foreground">Color:</span>
																	<Badge variant="outline" className="text-xs">
																		{item.color}
																	</Badge>
																</div>
															)}
														</div>
													</div>
												</TableCell>
												<TableCell className="text-center">
													KSh {(item.price / 100).toFixed(2)}
												</TableCell>
												<TableCell className="text-center">
													<div className="flex items-center justify-center gap-2">
														<Button
															variant="outline"
															size="sm"
															className="h-8 w-8 p-0"
															onClick={() => handleQuantityChange(item.id, item.color, item.quantity - 1)}
															disabled={item.quantity <= 1 || isUpdating}
														>
															<Minus className="h-3 w-3" />
														</Button>
														<span className="w-8 text-center font-medium">
															{item.quantity}
														</span>
														<Button
															variant="outline"
															size="sm"
															className="h-8 w-8 p-0"
															onClick={() => handleQuantityChange(item.id, item.color, item.quantity + 1)}
															disabled={isUpdating}
														>
															<Plus className="h-3 w-3" />
														</Button>
													</div>
												</TableCell>
												<TableCell className="text-center font-medium">
													KSh {((item.price * item.quantity) / 100).toFixed(2)}
												</TableCell>
												<TableCell className="text-center">
													<Button
														variant="outline"
														size="sm"
														className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
														onClick={() => handleRemoveItem(item.id, item.color)}
														disabled={isUpdating}
													>
														<Trash2 className="h-3 w-3" />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>

					{/* Order Summary */}
					<div className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>KSh {(subtotal / 100).toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span>Shipping</span>
										<span className="text-green-600">{shipping === 0 ? "Free" : `KSh ${(shipping / 100).toFixed(2)}`}</span>
									</div>
									<div className="flex justify-between">
										<span>Tax</span>
										<span>KSh {(tax / 100).toFixed(2)}</span>
									</div>

									<Separator className="my-2" />

									<div className="flex justify-between font-bold text-lg">
										<span>Total</span>
										<span>KSh {(total / 100).toFixed(2)}</span>
									</div>
								</div>

								<Button className="w-full" size="lg" asChild>
									<Link href="/checkout">
										<ShoppingBag className="mr-2 h-4 w-4" />
										Proceed to Checkout
									</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Trust Indicators */}
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-3 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 bg-green-500 rounded-full"></div>
										<span>Secure checkout</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 bg-green-500 rounded-full"></div>
										<span>Free shipping on orders over KSh 5,000</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 bg-green-500 rounded-full"></div>
										<span>30-day return policy</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Promo Code */}
						<Card>
							<CardContent className="pt-6">
								<h3 className="font-medium mb-2">Promo Code</h3>
								<div className="flex gap-2">
									<Input placeholder="Enter code" />
									<Button variant="outline">Apply</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			) : (
				<div className="text-center py-12">
					<h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
					<p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
					<Button asChild>
						<Link href="/products">Start Shopping</Link>
					</Button>
				</div>
			)}
		</div>
	)
}
