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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping")

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.07 // 7% tax
  const total = subtotal + shipping + tax

  return (
    <div className="container px-4 md:px-6 py-8">
      <Link href="/cart" className="flex items-center gap-2 text-sm mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={step} onValueChange={(value) => setStep(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="name@example.com" defaultValue="" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="(123) 456-7890" defaultValue="" />
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
                        <Input id="firstName" defaultValue="" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" defaultValue="" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                      <Input id="apartment" defaultValue="" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" defaultValue="" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" defaultValue="" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP code</Label>
                        <Input id="zip" defaultValue="" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep("payment")}>Continue to Payment</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <RadioGroup defaultValue="credit-card">
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Credit Card
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on card</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
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
            </TabsContent>

            <TabsContent value="review" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        John Doe
                        <br />
                        123 Main St
                        <br />
                        Apt 4B
                        <br />
                        New York, NY 10001
                      </p>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setStep("shipping")}>
                        Edit
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-medium">Payment Method</h3>
                      <p className="text-sm text-muted-foreground">Credit Card ending in 3456</p>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setStep("payment")}>
                        Edit
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-medium">Items</h3>
                      <ul className="space-y-2 mt-2">
                        {cartItems.map((item) => (
                          <li key={item.id} className="flex justify-between">
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
                                <div className="text-xs text-muted-foreground">Color: {item.color}</div>
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
                  <Button variant="outline" onClick={() => setStep("payment")}>
                    Back to Payment
                  </Button>
                  <Button>Place Order</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
                    <span>{shipping === 0 ? "Free" : `KSh ${shipping.toFixed(2)}`}</span>
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
