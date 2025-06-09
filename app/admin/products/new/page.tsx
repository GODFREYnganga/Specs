"use client";


import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function AdminAddProduct() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "prescription",
    image: "",
    description: "",
    inStock: true,
    frameShape: "",
    frameType: "",
    gender: "",
    material: "",
    weight: "",
    prescriptionType: "",
    frameWidth: "",
    productType: "",
    color: "",
    brand: "",
    size: "",
    features: "",
    images: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<(File | null)[]>([null, null, null])
  const additionalImageInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const [imagePreview, setImagePreview] = useState<string>("")

  // Dropdown options for eyewear fields
  const frameShapes = [
    "Round", "Square", "Cat Eye", "Aviator", "Rectangle", "Geometric", "Wayfarer", "Oval", "Browline", "Hexagonal"
  ]
  const frameTypes = [
    "Full Rim", "Semi-Rimless", "Rimless"
  ]
  const genders = [
    "Unisex", "Men", "Women", "Kids"
  ]
  const materials = [
    "Acetate", "Metal", "Titanium", "Plastic", "Stainless Steel", "TR90", "Wood", "Carbon Fiber"
  ]
  const prescriptionTypes = [
    "Single Vision", "Progressive", "Bifocal", "Non-Prescription", "Readers"
  ]
  const frameWidths = [
    "Narrow (less than 130mm)", "Medium (130mm-139mm)", "Wide (140mm and above)"
  ]
  const productTypes = [
    "Eyeglasses", "Sunglasses", "Blue Light", "Reading Glasses", "Fashion"
  ]
  const colors = [
    "Black", "Tortoise", "Crystal", "Gold", "Silver", "Blue", "Brown", "Red", "Green", "Pink", "White", "Grey", "Yellow", "Orange", "Purple", "Multi"
  ]
  const sizes = [
    "Small", "Medium", "Large", "Extra Large"
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleAdditionalImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setAdditionalImageFiles(prev => {
      const updated = [...prev]
      updated[index] = files && files[0] ? files[0] : null
      return updated
    })
  }

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e)
    setImagePreview(e.target.value)
  }

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0])
      setImagePreview(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      // 1. Upload main image file if provided
      let imageUrl = form.image
      if (imageInputRef.current && imageInputRef.current.files && imageInputRef.current.files[0]) {
        const file = imageInputRef.current.files[0]
        const formData = new FormData()
        formData.append("file", file)
        const uploadRes = await fetch("/api/products/upload", {
          method: "POST",
          body: formData,
        })
        if (!uploadRes.ok) throw new Error("Image upload failed")
        const { url } = await uploadRes.json()
        imageUrl = url
      }
      // 2. Upload additional images if provided
      let additionalImageUrls: string[] = []
      for (let i = 0; i < additionalImageFiles.length; i++) {
        const file = additionalImageFiles[i]
        if (file) {
          const formData = new FormData()
          formData.append("file", file)
          const uploadRes = await fetch("/api/products/upload", {
            method: "POST",
            body: formData,
          })
          if (!uploadRes.ok) throw new Error(`Additional image ${i + 1} upload failed`)
          const { url } = await uploadRes.json()
          additionalImageUrls.push(url)
        }
      }
      // 3. Submit product info with image URLs
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
          price: Number(form.price),
          features: form.features ? form.features.split(",").map(f => f.trim()) : [],
          images: additionalImageUrls,
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
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
          <Label htmlFor="image">Main Image</Label>
          <Input id="image" name="image" type="file" ref={imageInputRef} onChange={handleImageFile} accept="image/*" required />
          {imagePreview && <Image src={imagePreview} alt="Preview" width={100} height={100} />}
        </div>
        <div>
          <Label>Additional Images</Label>
          {additionalImageInputRefs.map((ref, index) => (
            <div key={index} className="mt-2">
              <Input
                type="file"
                ref={ref}
                onChange={(e) => handleAdditionalImageChange(index, e)}
                accept="image/*"
              />
            </div>
          ))}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <Label htmlFor="features">Features (comma separated)</Label>
          <Input id="features" name="features" value={form.features} onChange={handleChange} placeholder="Feature 1, Feature 2" />
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" name="brand" value={form.brand} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <select id="color" name="color" value={form.color} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select color</option>
            {colors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="size">Frame Size</Label>
          <select id="size" name="size" value={form.size} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select size</option>
            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="frameShape">Frame Shape</Label>
          <select id="frameShape" name="frameShape" value={form.frameShape} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select shape</option>
            {frameShapes.map(shape => <option key={shape} value={shape}>{shape}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="frameType">Frame Type</Label>
          <select id="frameType" name="frameType" value={form.frameType} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select type</option>
            {frameTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <select id="gender" name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select gender</option>
            {genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="material">Material</Label>
          <select id="material" name="material" value={form.material} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select material</option>
            {materials.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="weight">Weight</Label>
          <Input id="weight" name="weight" value={form.weight} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="prescriptionType">Prescription Type</Label>
          <select id="prescriptionType" name="prescriptionType" value={form.prescriptionType} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select type</option>
            {prescriptionTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="frameWidth">Frame Width</Label>
          <select id="frameWidth" name="frameWidth" value={form.frameWidth} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select width</option>
            {frameWidths.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="productType">Product Type</Label>
          <select id="productType" name="productType" value={form.productType} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select type</option>
            {productTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input id="inStock" name="inStock" type="checkbox" checked={form.inStock} onChange={handleChange} />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Product"}</Button>
      </form>
      {/* Bulk Upload Section */}
      <hr className="my-6" />
      <h3 className="text-xl font-bold mb-2">Bulk Product Upload</h3>
      <div className="mb-2">
        <Button type="button" onClick={() => window.location.href = '/api/products/csv-template'}>Download CSV Template</Button>
      </div>
      <form className="space-y-2" action="/api/products/bulk-upload" method="POST" encType="multipart/form-data">
        <div>
          <Label htmlFor="csvFile">CSV File</Label>
          <input id="csvFile" name="csvFile" type="file" accept=".csv" required />
        </div>
        <div>
          <Label htmlFor="imagesZip">Images Zip</Label>
          <input id="imagesZip" name="imagesZip" type="file" accept=".zip" required />
        </div>
        <Button type="submit">Upload Bulk Products</Button>
      </form>
    </Card>
  )
}
