import { NextResponse } from "next/server"
import type { Product } from "@/types/product"

// This would typically come from a database
const products: Product[] = [
  {
    id: 1,
    name: "Urban Classic",
    price: 12999,
    category: "prescription",
    image: "/placeholder.svg?height=300&width=300",
    description: "Timeless design with modern comfort",
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
    description: "UV protection with style",
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
    description: "Comfortable frames for extended reading",
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  if (category) {
    const filteredProducts = products.filter((product) => product.category === category)
    return NextResponse.json(filteredProducts)
  }

  return NextResponse.json(products)
}
