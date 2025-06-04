export interface CartItem {
  id: number
  name: string
  price: number
  color: string
  quantity: number
  image: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
}
