import { NextResponse } from "next/server"
import type { Product } from "@/types/product"

// Update the prices in the products array
const products: Product[] = [
  {
    id: 1,
    name: "Urban Classic",
    price: 12999,
    category: "prescription",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "The Urban Classic frames combine timeless design with modern comfort. These versatile frames are perfect for everyday wear, featuring premium acetate material and spring hinges for durability and comfort.",
    features: [
      "Premium acetate material",
      "Spring hinges for comfort",
      "Anti-scratch coating",
      "UV protection",
      "Includes hard case and cleaning cloth",
    ],
    colors: ["Black", "Tortoise", "Crystal"],
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    id: 2,
    name: "Sunset Aviator",
    price: 14999,
    category: "sunglasses",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "The Sunset Aviator sunglasses offer classic style with modern protection. Featuring polarized lenses and 100% UV protection, these sunglasses are perfect for driving, outdoor activities, or just looking cool.",
    features: [
      "Polarized lenses",
      "100% UV protection",
      "Lightweight metal frame",
      "Adjustable nose pads",
      "Includes case and microfiber cloth",
    ],
    colors: ["Gold", "Silver", "Black"],
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 4.6,
    reviews: 98,
    inStock: true,
  },
  {
    id: 3,
    name: "Reading Pro",
    price: 10999,
    category: "reading",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "The Reading Pro glasses are designed for comfort during extended reading sessions. With blue light filtering and anti-glare coating, these glasses reduce eye strain during long reading or screen time. The lightweight frame ensures they remain comfortable even after hours of wear.",
    features: [
      "Blue light filtering",
      "Anti-glare coating",
      "Lightweight frame",
      "Spring hinges",
      "Multiple magnification options",
    ],
    colors: ["Black", "Brown", "Blue"],
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 4.5,
    reviews: 76,
    inStock: true,
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const product = products.find((p) => p.id === id)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}
