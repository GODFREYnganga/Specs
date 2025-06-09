"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
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

export default function CheckoutPage() {
	const { cart, clearCart } = useCart()
	const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping")
	const [form, setForm] = useState({
		email: "",
		phone: "",
		firstName: "",
		lastName: "",
		address: "",
		apartment: "",
		city: "",
		state: "",
		zip: "",
		cardName: "",
		cardNumber: "",
		expiry: "",
		cvc: "",
		paymentMethod: "credit-card",
	})
	const [placingOrder, setPlacingOrder] = useState(false)
	const [orderSuccess, setOrderSuccess] = useState(false)
	const [orderError, setOrderError] = useState("")

	const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
	const shipping = 0 // Free shipping
	const tax = subtotal * 0.07 // 7% tax
	const total = subtotal + shipping + tax

	// Handle input changes
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setForm({ ...form, [e.target.id]: e.target.value })
	}

	async function handlePlaceOrder() {
		setPlacingOrder(true)
		setOrderError("")
		try {
			const res = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items: cart,
					shippingAddress: {
						street: form.address,
						apartment: form.apartment,
						city: form.city,
						state: form.state,
						zipCode: form.zip,
						country: "Kenya",
					},
					paymentMethod: {
						type: form.paymentMethod,
						lastFour: form.cardNumber.slice(-4),
					},
					contact: {
						email: form.email,
						phone: form.phone,
					},
				}),
			})
			if (!res.ok) throw new Error("Failed to place order")
			setOrderSuccess(true)
			clearCart()
		} catch (err) {
			setOrderError("Failed to place order. Please try again.")
		} finally {
			setPlacingOrder(false)
		}
	}

	if (orderSuccess) {
		return (
			<div className="container px-4 md:px-6 py-8 text-center">
				<h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
				<p className="mb-6">Your order has been placed successfully. You will receive a confirmation email soon.</p>
				<Link href="/products">
					<Button>Continue Shopping</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className="container px-4 md:px-6 py-8">
			<Link href="/cart" className="flex items-center gap-2 text-sm mb-6 hover:underline">
				<ArrowLeft className="h-4 w-4" />
				Back to Cart
			</Link>

			<h1 className="text-3xl font-bold mb-6">Checkout</h1>

			<div className="grid md:grid-cols-3 gap-8">
				<div className="md:col-span-2">
					{/* Stepper navigation */}
					<div className="flex mb-6 gap-2">
						{["shipping", "payment", "review"].map((s, i) => (
							<Button
								key={s}
								variant={step === s ? "default" : "outline"}
								onClick={() => setStep(s as any)}
							>
								{s.charAt(0).toUpperCase() + s.slice(1)}
							</Button>
						))}
					</div>
					{/* Step content */}
					{step === "shipping" && (
						<div className="space-y-6">
							<div>
								<h2 className="text-xl font-semibold mb-4">Contact Information</h2>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="name@example.com"
											value={form.email}
											onChange={handleChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="phone">Phone</Label>
										<Input
											id="phone"
											type="tel"
											placeholder="(123) 456-7890"
											value={form.phone}
											onChange={handleChange}
										/>
									</div>
								</div>
							</div>

							<Separator />

							<div>
								<h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="firstName">First name</Label>
											<Input
												id="firstName"
												value={form.firstName}
												onChange={handleChange}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="lastName">Last name</Label>
											<Input
												id="lastName"
												value={form.lastName}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="address">Address</Label>
										<Input
											id="address"
											value={form.address}
											onChange={handleChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
										<Input
											id="apartment"
											value={form.apartment}
											onChange={handleChange}
										/>
									</div>
									<div className="grid grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor="city">City</Label>
											<Input
												id="city"
												value={form.city}
												onChange={handleChange}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="state">State</Label>
											<Input
												id="state"
												value={form.state}
												onChange={handleChange}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="zip">ZIP code</Label>
											<Input
												id="zip"
												value={form.zip}
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="flex justify-end">
								<Button onClick={() => setStep("payment")}>Continue to Payment</Button>
							</div>
						</div>
					)}
					{step === "payment" && (
						<div className="space-y-6">
							<div>
								<h2 className="text-xl font-semibold mb-4">Payment Method</h2>
								<RadioGroup
									defaultValue="credit-card"
									onValueChange={(value) =>
										setForm({ ...form, paymentMethod: value })
									}
								>
									<div className="flex items-center space-x-2 border rounded-md p-4">
										<RadioGroupItem value="credit-card" id="credit-card" />
										<Label
											htmlFor="credit-card"
											className="flex items-center gap-2"
										>
											<CreditCard className="h-4 w-4" />
											Credit Card
										</Label>
									</div>
								</RadioGroup>
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="cardName">Name on card</Label>
									<Input
										id="cardName"
										placeholder="John Doe"
										value={form.cardName}
										onChange={handleChange}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="cardNumber">Card number</Label>
									<Input
										id="cardNumber"
										placeholder="1234 5678 9012 3456"
										value={form.cardNumber}
										onChange={handleChange}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="expiry">Expiry date</Label>
										<Input
											id="expiry"
											placeholder="MM/YY"
											value={form.expiry}
											onChange={handleChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="cvc">CVC</Label>
										<Input
											id="cvc"
											placeholder="123"
											value={form.cvc}
											onChange={handleChange}
										/>
									</div>
								</div>
							</div>

							<div className="flex justify-between">
								<Button variant="outline" onClick={() => setStep("shipping")}>
									Back to Shipping
								</Button>
								<Button onClick={() => setStep("review")}>Review Order</Button>
							</div>
						</div>
					)}
					{step === "review" && (
						<div className="space-y-6">
							<div>
								<h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
								<div className="space-y-4">
									<div>
										<h3 className="font-medium">Shipping Address</h3>
										<p className="text-sm text-muted-foreground">
											{form.firstName} {form.lastName}
											<br />
											{form.address}
											<br />
											{form.apartment}
											<br />
											{form.city}, {form.state} {form.zip}
										</p>
										<Button
											variant="link"
											className="p-0 h-auto"
											onClick={() => setStep("shipping")}
										>
											Edit
										</Button>
									</div>

									<div>
										<h3 className="font-medium">Payment Method</h3>
										<p className="text-sm text-muted-foreground">
											Credit Card ending in {form.cardNumber.slice(-4)}
										</p>
										<Button
											variant="link"
											className="p-0 h-auto"
											onClick={() => setStep("payment")}
										>
											Edit
										</Button>
									</div>

									<div>
										<h3 className="font-medium">Items</h3>
										<ul className="space-y-2 mt-2">
											{cart.map((item) => (
												<li key={item.id + (item.color || "") } className="flex justify-between">
													<div className="flex items-center gap-2">
														<img
															src={item.image || "/placeholder.svg"}
															alt={item.name}
															width={40}
															height={40}
															className="rounded-md"
														/>
														<div>
															<div className="font-medium">{item.name}</div>
															<div className="text-xs text-muted-foreground">
																Color: {item.color}
															</div>
														</div>
													</div>
													<div>KSh {(item.price * item.quantity).toFixed(2)}</div>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>

							<div className="flex justify-between">
								<Button variant="outline" onClick={() => setStep("payment")}>Back to Payment</Button>
								<Button onClick={handlePlaceOrder} disabled={placingOrder}>
									{placingOrder ? "Placing..." : "Place Order"}
								</Button>
							</div>
							{orderSuccess && (
								<div className="text-green-600 font-bold">
									Order placed successfully!
								</div>
							)}
							{orderError && (
								<div className="text-red-600 font-bold">{orderError}</div>
							)}
						</div>
					)}
				</div>

				<div>
					<Card>
						<CardContent className="p-6">
							<h2 className="text-xl font-bold mb-4">Order Summary</h2>

							<div className="space-y-4">
								<div className="space-y-1">
									{cartItems.map((item) => (
										<div key={item.id} className="flex justify-between text-sm">
											<span>
												{item.name} × {item.quantity}
											</span>
											<span>KSh {(item.price * item.quantity).toFixed(2)}</span>
										</div>
									))}
								</div>

								<Separator />

								<div className="space-y-2">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>KSh {subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span>Shipping</span>
										<span>
											{Number(shipping) === 0 ? "Free" : `KSh ${Number(shipping).toFixed(2)}`}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Tax</span>
										<span>KSh {tax.toFixed(2)}</span>
									</div>
								</div>

								<Separator />

								<div className="flex justify-between font-bold">
									<span>Total</span>
									<span>KSh {total.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
