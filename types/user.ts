export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  address?: {
    street: string
    apartment?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  orders?: Order[]
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    street: string
    apartment?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: {
    type: "credit_card" | "paypal"
    lastFour?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: number
  name: string
  price: number
  quantity: number
  color: string
}
