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

  // Dropdown options for enums with correct values
  const frameShapes = [
    { value: "round", label: "Round" },
    { value: "square", label: "Square" },
    { value: "cat-eye", label: "Cat Eye" },
    { value: "aviator", label: "Aviator" },
    { value: "rectangle", label: "Rectangle" },
    { value: "geometric", label: "Geometric" },
    { value: "wayfarer", label: "Wayfarer" },
    { value: "oval", label: "Oval" },
    { value: "browline", label: "Browline" },
    { value: "hexagonal", label: "Hexagonal" },
  ]
  const frameTypes = [
    { value: "full-rim", label: "Full Rim" },
    { value: "semi-rimless", label: "Semi-Rimless" },
    { value: "rimless", label: "Rimless" },
  ]
  const genders = [
    { value: "unisex", label: "Unisex" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "kids", label: "Kids" },
  ]
  const materials = [
    { value: "acetate", label: "Acetate" },
    { value: "metal", label: "Metal" },
    { value: "titanium", label: "Titanium" },
    { value: "plastic", label: "Plastic" },
    { value: "stainless steel", label: "Stainless Steel" },
    { value: "tr90", label: "TR90" },
    { value: "wood", label: "Wood" },
    { value: "carbon fiber", label: "Carbon Fiber" },
  ]
  const prescriptionTypes = [
    { value: "single-vision", label: "Single Vision" },
    { value: "progressive", label: "Progressive" },
    { value: "bifocal", label: "Bifocal" },
    { value: "non-prescription", label: "Non-Prescription" },
    { value: "readers", label: "Readers" },
  ]
  const frameWidths = [
    { value: "narrow (less than 130mm)", label: "Narrow (less than 130mm)" },
    { value: "medium (130mm-139mm)", label: "Medium (130mm-139mm)" },
    { value: "wide (140mm and above)", label: "Wide (140mm and above)" },
  ]
  const productTypes = [
    { value: "eyeglasses", label: "Eyeglasses" },
    { value: "sunglasses", label: "Sunglasses" },
    { value: "blue-light", label: "Blue Light" },
    { value: "reading-glasses", label: "Reading Glasses" },
    { value: "fashion", label: "Fashion" },
  ]
  const sizes = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "extra large", label: "Extra Large" },
  ]
  const colors = [
    { value: "black", label: "Black" },
    { value: "tortoise", label: "Tortoise" },
    { value: "crystal", label: "Crystal" },
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
    { value: "blue", label: "Blue" },
    { value: "brown", label: "Brown" },
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "pink", label: "Pink" },
    { value: "white", label: "White" },
    { value: "grey", label: "Grey" },
    { value: "yellow", label: "Yellow" },
    { value: "orange", label: "Orange" },
    { value: "purple", label: "Purple" },
    { value: "multi", label: "Multi" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
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

  const handleAddColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), color],
    }))
  }

  const handleRemoveColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: (prev.colors || []).filter((c) => c !== color),
    }))
  }

  const handleAddFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: [...(prev.features || []), feature],
    }))
  }

  const handleRemoveFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((f) => f !== feature),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const productFormData = new FormData();

      // Append all form fields from the 'form' state
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'features' && typeof value === 'string') {
          value.split(",").map(f => f.trim()).forEach(feature => productFormData.append('features[]', feature));
        } else if (key === 'colors' && typeof value === 'string') {
          // Assuming colors are also comma-separated in the form state for now
          // Adjust if colors are handled differently (e.g., an array in state)
          value.split(",").map(c => c.trim()).forEach(color => productFormData.append('colors[]', color));
        } else if (key === 'images') {
          // Skip 'images' from the main form state if handled by additionalImageFiles
        }
        else {
          productFormData.append(key, String(value));
        }
      });

      // 1. Handle main image file
      if (imageInputRef.current && imageInputRef.current.files && imageInputRef.current.files[0]) {
        productFormData.append("image", imageInputRef.current.files[0]);
      } else if (additionalImageFiles[0]) {
        // Use first additional image as main image if main image is not set
        productFormData.append("image", additionalImageFiles[0]);
      } else if (form.image) {
        // If image is a URL (e.g. already uploaded or external)
        productFormData.append("image", form.image);
      }


      // 2. Handle additional images if your backend supports multiple 'images' fields or an array
      additionalImageFiles.forEach((file) => {
        if (file) {
          productFormData.append("additionalImages[]", file); // Adjust field name as per backend
        }
      });

      // 3. Submit product info
      const res = await fetch("/api/products", {
        method: "POST",
        body: productFormData, // Send FormData directly, browser sets Content-Type
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add product");
      }
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            {colors.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="size">Frame Size</Label>
          <select id="size" name="size" value={form.size} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select size</option>
            {sizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="frameShape">Frame Shape</Label>
          <select id="frameShape" name="frameShape" value={form.frameShape} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select shape</option>
            {frameShapes.map(shape => <option key={shape.value} value={shape.value}>{shape.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="frameType">Frame Type</Label>
          <select id="frameType" name="frameType" value={form.frameType} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select type</option>
            {frameTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <select id="gender" name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select gender</option>
            {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="material">Material</Label>
          <select id="material" name="material" value={form.material} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select material</option>
            {materials.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
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
            {prescriptionTypes.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="frameWidth">Frame Width</Label>
          <select id="frameWidth" name="frameWidth" value={form.frameWidth} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select width</option>
            {frameWidths.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="productType">Product Type</Label>
          <select id="productType" name="productType" value={form.productType} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Select type</option>
            {productTypes.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
          </select>
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
