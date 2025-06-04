"use client";


import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function AdminAddProduct() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "prescription",
    image: "",
    description: "",
    inStock: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      })
      if (!res.ok) throw new Error("Failed to add product")
      router.push("/admin/products")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
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
          <Input id="image" name="image" value={form.image} onChange={handleChange} required />
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
        <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Product"}</Button>
      </form>
    </Card>
  )
}
