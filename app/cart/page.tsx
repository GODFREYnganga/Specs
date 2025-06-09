"use client"

import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCart } from "@/hooks/use-cart"

// This would typically come from a cart state or API
const cartItems = [
	{
		id: 1,
		name: "Urban Classic",
		price: 12999,
		color: "Black",
		quantity: 1,
		image: "/placeholder.svg?height=100&width=100",
	},
	{
		id: 2,
		name: "Sunset Aviator",
		price: 14999,
		color: "Gold",
		quantity: 1,
		image: "/placeholder.svg?height=100&width=100",
	},
]

export default function CartPage() {
	const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart()
	const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
	const shipping = 0 // Free shipping
	const tax = subtotal * 0.07 // 7% tax
	const total = subtotal + shipping + tax

	return (
		<div className="container px-4 md:px-6 py-8">
			<h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

			{cart.length > 0 ? (
				<div className="grid md:grid-cols-3 gap-8">
					<div className="md:col-span-2">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Quantity</TableHead>
									<TableHead>Total</TableHead>
									<TableHead className="w-[50px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cart.map((item) => (
									<TableRow key={item.id + (item.color || "")}> {/* color for unique key */}
										<TableCell>
											<div className="flex items-center gap-4">
												<img
													src={item.image || "/placeholder.svg"}
													alt={item.name}
													width={80}
													height={80}
													className="rounded-md"
												/>
												<div>
													<div className="font-medium">{item.name}</div>
													<div className="text-sm text-muted-foreground">Color: {item.color}</div>
												</div>
											</div>
										</TableCell>
										<TableCell>KSh {(item.price / 100).toFixed(2)}</TableCell>
										<TableCell>
											<div className="flex items-center">
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8 rounded-r-none"
													onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
												>
													<Minus className="h-3 w-3" />
												</Button>
												<Input
													type="number"
													min="1"
													value={item.quantity}
													onChange={(e) => {
														const newQuantity = Number.parseInt(e.target.value) || 1
														updateQuantity(item.id, item.color, newQuantity)
													}}
													className="h-8 w-12 rounded-none text-center"
												/>
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8 rounded-l-none"
													onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
												>
													<Plus className="h-3 w-3" />
												</Button>
											</div>
										</TableCell>
										<TableCell>KSh {((item.price * item.quantity) / 100).toFixed(2)}</TableCell>
										<TableCell>
											<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id, item.color)}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<div className="flex justify-between mt-6">
							<Button variant="outline" asChild>
								<Link href="/products">Continue Shopping</Link>
							</Button>
							<Button variant="outline" onClick={clearCart}>Clear Cart</Button>
						</div>
					</div>

					<div>
						<div className="bg-muted/50 rounded-lg p-6">
							<h2 className="text-xl font-bold mb-4">Order Summary</h2>

							<div className="space-y-2">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>KSh {(subtotal / 100).toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span>Shipping</span>
									<span>{shipping === 0 ? "Free" : `KSh ${(shipping / 100).toFixed(2)}`}</span>
								</div>
								<div className="flex justify-between">
									<span>Tax</span>
									<span>KSh {(tax / 100).toFixed(2)}</span>
								</div>

								<Separator className="my-2" />

								<div className="flex justify-between font-bold">
									<span>Total</span>
									<span>KSh {(total / 100).toFixed(2)}</span>
								</div>
							</div>

							<Button className="w-full mt-6" size="lg" asChild>
								<Link href="/checkout">Proceed to Checkout</Link>
							</Button>

							<div className="mt-6">
								<h3 className="font-medium mb-2">Promo Code</h3>
								<div className="flex gap-2">
									<Input placeholder="Enter code" />
									<Button variant="outline">Apply</Button>
								</div>
							</div>
						</div>
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
