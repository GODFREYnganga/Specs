export interface Product {
  id: number
  name: string
  price: number
  description: string
  category: "prescription" | "sunglasses" | "reading"
  image: string
  features?: string[]
  colors?: string[]
  images?: string[]
  rating?: number
  reviews?: number
  inStock?: boolean
}
