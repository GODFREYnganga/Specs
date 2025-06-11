"use client"

import { CardFooter } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Check, Heart, ShoppingCart, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter() // Ensure `useRouter` is used in a client component.

  const [product, setProduct] = useState<any>(null)
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function fetchProduct() {
      if (!params?.id) return;
      if (!router) {
        console.error("Router is not mounted.");
        return;
      }
      const res = await fetch(`/api/products/${params.id}`)
      if (!res.ok) {
        router.push("/products")
        return
      }
      const data = await res.json()
      setProduct(data)
      setSelectedColor(data.colors && data.colors.length > 0 ? data.colors[0] : "")
    }
    fetchProduct()
  }, [params?.id, router])

  if (!product) {
    return <div>Loading...</div>
  }

  // Fallback for main image
  const mainImage = (product.images && product.images.length > 0 && product.images[0]) || product.image || "/placeholder.svg";
  const additionalImages = product.images && product.images.length > 1 ? product.images.slice(1) : [];

  return (
    <div className="container px-4 md:px-6 py-8">
      <Link href="/products" className="flex items-center gap-2 text-sm mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
              width={600}
              height={600}
            />
          </div>
          {additionalImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {additionalImages.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`Additional ${index}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="text-2xl font-bold">KSh {product.price}</div>

          {product.inStock ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span>In Stock</span>
            </div>
          ) : (
            <div className="text-red-500">Out of Stock</div>
          )}

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Frame Color</h3>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
              {product.colors && product.colors.length > 0 ? (
                product.colors.map((color: string) => (
                  <div key={color} className="flex items-center space-x-2">
                    <RadioGroupItem value={color} id={color} />
                    <Label htmlFor={color}>{color}</Label>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No colors available</div>
              )}
            </RadioGroup>
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded px-2">
              <button
                className="px-2 py-1 text-lg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-12 text-center bg-transparent outline-none"
              />
              <button
                className="px-2 py-1 text-lg"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={() =>
                  addToCart({
                    id: String(product._id),
                    name: product.name,
                    price: product.price,
                    image: mainImage,
                    color: selectedColor,
                    quantity,
                  })
                }
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant={isInWishlist(String(product._id), selectedColor) ? "default" : "outline"}
                onClick={() => {
                  if (isInWishlist(String(product._id), selectedColor)) {
                    removeFromWishlist(String(product._id), selectedColor)
                  } else {
                    addToWishlist({
                      id: String(product._id),
                      name: product.name,
                      price: product.price,
                      image: mainImage,
                      color: selectedColor,
                      category: product.category as any,
                      description: product.description || "",
                    })
                  }
                }}
                aria-label={isInWishlist(String(product._id), selectedColor) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p>{product.description}</p>
            </TabsContent>
            <TabsContent value="features" className="pt-4">
              <ul className="list-disc pl-5 space-y-2">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))
                ) : (
                  <li>No features listed.</li>
                )}
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <p>
                Free shipping on all orders over $50. Standard delivery takes 3-5 business days. Express shipping
                options are available at checkout for an additional fee. International shipping is available to select
                countries.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="overflow-hidden">
              <CardHeader className="p-0">
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt="Related product"
                  width={300}
                  height={300}
                  className="object-cover w-full aspect-square"
                />
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold">Similar Style Frame</h3>
                <div className="text-sm font-medium mt-1">KSh 119.99</div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
