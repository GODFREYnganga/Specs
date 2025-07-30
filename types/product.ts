export interface Product {
  id: number
  name: string
  price: number
  description: string
  product_description?: string // From bulk upload
  short_technical_information?: string // From bulk upload
  long_technical_information?: string // From bulk upload
  category: "prescription" | "sunglasses" | "reading"
  image: string
  features?: string[]
  colors?: string[]
  images?: string[]
  rating?: number
  reviews?: number
  inStock?: boolean
}
