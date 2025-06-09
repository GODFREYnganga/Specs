"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function AdminEditProduct() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "prescription",
    image: "",
    description: "",
    inStock: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    if (!productId) return
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          price: data.price?.toString() || "",
          category: data.category || "prescription",
          image: data.image || "",
          description: data.description || "",
          inStock: data.inStock ?? true,
        })
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false))
  }, [productId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e)
    setImagePreview(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      })
      if (!res.ok) throw new Error("Failed to update product")
      router.push("/admin/products")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (form.image) setImagePreview(form.image)
  }, [form.image])

  if (loading) return <div>Loading...</div>

  return (
    <Card className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="price">Price (KSh)</Label>
          <Input id="price" name="price" type="number" value={form.price} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select id="category" name="category" value={form.category} onChange={handleChange} className="w-full border rounded p-2">
            <option value="prescription">Prescription</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="reading">Reading</option>
            <option value="blue-light">Blue Light</option>
            <option value="fashion">Fashion</option>
          </select>
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" name="image" value={form.image} onChange={handleImageInput} required />
          {imagePreview && (
            <div className="mt-2">
              <Image src={imagePreview} alt="Preview" width={200} height={200} className="rounded border" />
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div className="flex items-center gap-2">
          <input id="inStock" name="inStock" type="checkbox" checked={form.inStock} onChange={handleChange} />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
      </form>
    </Card>
  )
}
