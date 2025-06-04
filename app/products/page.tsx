"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

// This would typically come from an API
const allProducts = [
  {
    id: 1,
    name: "Urban Classic",
    price: 12999,
    category: "prescription",
    image: "/images/products/gold-round-frames.png",
    description: "Timeless design with modern comfort",
    frameShape: "round",
    frameType: "full-rim",
    gender: "unisex",
    material: "acetate",
    weight: "light",
    prescriptionType: "single-vision",
    frameWidth: "medium",
    productType: "eyeglasses",
    color: "gold",
    brand: "Fashionista",
    size: "medium",
  },
  {
    id: 2,
    name: "Sunset Aviator",
    price: 14999,
    category: "sunglasses",
    image: "/images/products/blue-round-frames.png",
    description: "UV protection with style",
    frameShape: "aviator",
    frameType: "full-rim",
    gender: "unisex",
    material: "metal",
    weight: "light",
    prescriptionType: "non-prescription",
    frameWidth: "wide",
    productType: "sunglasses",
    color: "blue",
    brand: "SunPro",
    size: "large",
  },
  {
    id: 3,
    name: "Reading Pro",
    price: 10999,
    category: "reading",
    image: "/images/products/black-round-frames.png",
    description: "Comfortable frames for extended reading",
    frameShape: "round",
    frameType: "full-rim",
    gender: "unisex",
    material: "acetate",
    weight: "light",
    prescriptionType: "reading",
    frameWidth: "narrow",
    productType: "reading-glasses",
    color: "black",
    brand: "EyeRest",
    size: "small",
  },
  {
    id: 4,
    name: "Sport Shield",
    price: 15999,
    category: "sunglasses",
    image: "/images/products/white-cat-eye-frames.png",
    description: "Active lifestyle protection",
    frameShape: "cat-eye",
    frameType: "full-rim",
    gender: "women",
    material: "plastic",
    weight: "medium",
    prescriptionType: "non-prescription",
    frameWidth: "medium",
    productType: "sunglasses",
    color: "white",
    brand: "SunPro",
    size: "medium",
  },
  {
    id: 5,
    name: "Vintage Round",
    price: 11999,
    category: "prescription",
    image: "/images/products/navy-blue-frames.png",
    description: "Classic round frames with modern materials",
    frameShape: "round",
    frameType: "full-rim",
    gender: "unisex",
    material: "acetate",
    weight: "medium",
    prescriptionType: "progressive",
    frameWidth: "medium",
    productType: "eyeglasses",
    color: "blue",
    brand: "Vintage",
    size: "medium",
  },
  {
    id: 6,
    name: "Office Edge",
    price: 13999,
    category: "prescription",
    image: "/images/products/black-blue-light-frames.png",
    description: "Professional look for the workplace",
    frameShape: "square",
    frameType: "semi-rimless",
    gender: "men",
    material: "metal",
    weight: "light",
    prescriptionType: "blue-light",
    frameWidth: "wide",
    productType: "blue-light",
    color: "black",
    brand: "BlueGuard",
    size: "large",
  },
  {
    id: 7,
    name: "Beach Vibes",
    price: 12999,
    category: "sunglasses",
    image: "/images/products/silver-round-frames.png",
    description: "Polarized lenses for bright days",
    frameShape: "round",
    frameType: "full-rim",
    gender: "unisex",
    material: "metal",
    weight: "light",
    prescriptionType: "non-prescription",
    frameWidth: "medium",
    productType: "sunglasses",
    color: "silver",
    brand: "SunPro",
    size: "medium",
  },
  {
    id: 8,
    name: "Night Reader",
    price: 10999,
    category: "reading",
    image: "/images/products/clear-frames.png",
    description: "Anti-glare coating for evening reading",
    frameShape: "square",
    frameType: "full-rim",
    gender: "unisex",
    material: "plastic",
    weight: "light",
    prescriptionType: "reading",
    frameWidth: "narrow",
    productType: "reading-glasses",
    color: "clear",
    brand: "EyeRest",
    size: "small",
  },
  {
    id: 9,
    name: "Celestial Frames",
    price: 14999,
    category: "fashion",
    image: "/images/products/rose-gold-moon-frames.png",
    description: "Unique design for the fashion-forward",
    frameShape: "round",
    frameType: "full-rim",
    gender: "women",
    material: "metal",
    weight: "light",
    prescriptionType: "single-vision",
    frameWidth: "medium",
    productType: "eyeglasses",
    color: "rose-gold",
    brand: "StyleIcon",
    size: "medium",
  },
  {
    id: 10,
    name: "Digital Defender",
    price: 11999,
    category: "blue-light",
    image: "/images/products/frame-game-collage.png",
    description: "Blue light protection for digital screens",
    frameShape: "square",
    frameType: "full-rim",
    gender: "unisex",
    material: "acetate",
    weight: "medium",
    prescriptionType: "blue-light",
    frameWidth: "medium",
    productType: "blue-light",
    color: "multi",
    brand: "BlueGuard",
    size: "medium",
  },
]

// Update the interface for the Category type to match our enhanced structure
interface Category {
  id: string
  title: string
  options: { value: string; label: string }[]
}

// Update the filter sections to match the requested layout
const filterSections: Category[] = [
  {
    id: "price-range",
    title: "PRICE RANGE",
    options: [], // This is handled separately with the slider
  },
  {
    id: "size",
    title: "SIZE",
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
  },
  {
    id: "color",
    title: "COLOR",
    options: [
      { value: "black", label: "Black" },
      { value: "gold", label: "Gold" },
      { value: "silver", label: "Silver" },
      { value: "blue", label: "Blue" },
      { value: "clear", label: "Clear" },
      { value: "rose-gold", label: "Rose Gold" },
      { value: "white", label: "White" },
      { value: "multi", label: "Multi-color" },
    ],
  },
  {
    id: "frameType",
    title: "FRAME TYPE",
    options: [
      { value: "full-rim", label: "Full Rim" },
      { value: "semi-rimless", label: "Semi-Rimless" },
      { value: "rimless", label: "Rimless" },
    ],
  },
  {
    id: "frameShape",
    title: "FRAME SHAPE",
    options: [
      { value: "round", label: "Round" },
      { value: "square", label: "Square" },
      { value: "cat-eye", label: "Cat Eye" },
      { value: "aviator", label: "Aviator" },
      { value: "rectangle", label: "Rectangle" },
      { value: "geometric", label: "Geometric" },
    ],
  },
  {
    id: "brand",
    title: "BRANDS",
    options: [
      { value: "Fashionista", label: "Fashionista" },
      { value: "SunPro", label: "SunPro" },
      { value: "EyeRest", label: "EyeRest" },
      { value: "BlueGuard", label: "BlueGuard" },
      { value: "StyleIcon", label: "StyleIcon" },
      { value: "Vintage", label: "Vintage" },
    ],
  },
  {
    id: "gender",
    title: "GENDER",
    options: [
      { value: "men", label: "Men" },
      { value: "women", label: "Women" },
      { value: "unisex", label: "Unisex" },
    ],
  },
  {
    id: "material",
    title: "MATERIAL",
    options: [
      { value: "acetate", label: "Acetate" },
      { value: "metal", label: "Metal" },
      { value: "plastic", label: "Plastic" },
      { value: "titanium", label: "Titanium" },
    ],
  },
  {
    id: "weight",
    title: "WEIGHT GROUP",
    options: [
      { value: "light", label: "Light" },
      { value: "medium", label: "Medium" },
      { value: "heavy", label: "Heavy" },
    ],
  },
  {
    id: "prescriptionType",
    title: "PRESCRIPTION TYPE",
    options: [
      { value: "single-vision", label: "Single Vision" },
      { value: "progressive", label: "Progressive" },
      { value: "reading", label: "Reading" },
      { value: "non-prescription", label: "Non-Prescription" },
      { value: "blue-light", label: "Blue Light" },
    ],
  },
  {
    id: "frameWidth",
    title: "FRAME WIDTH",
    options: [
      { value: "narrow", label: "Narrow" },
      { value: "medium", label: "Medium" },
      { value: "wide", label: "Wide" },
    ],
  },
  {
    id: "productType",
    title: "PRODUCT TYPE",
    options: [
      { value: "eyeglasses", label: "Eyeglasses" },
      { value: "sunglasses", label: "Sunglasses" },
      { value: "reading-glasses", label: "Reading Glasses" },
      { value: "blue-light", label: "Blue Light Glasses" },
    ],
  },
]

interface FilterSection {
  id: string
  title: string
  options: { value: string; label: string }[]
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const genderParam = searchParams.get("gender")
  const frameTypeParam = searchParams.get("frameType")
  const styleParam = searchParams.get("style")
  const brandParam = searchParams.get("brand")
  const topPickParam = searchParams.get("topPick")

  const [products, setProducts] = useState(allProducts)
  const [filters, setFilters] = useState({
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [8000, 22000],
    frameShape: "all",
    searchQuery: "",
    sortBy: "featured",
    gender: genderParam || "all",
    frameType: frameTypeParam || "all",
    color: "all",
    brand: brandParam || "all",
    material: "all",
    weight: "all",
    prescriptionType: "all",
    frameWidth: "all",
    productType: "all",
    size: "all",
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    priceRange: true,
    category: true,
    size: true,
    color: true,
    frameType: true,
    frameShape: true,
    brands: true,
    gender: true,
    material: true,
    weight: true,
    prescriptionType: true,
    frameWidth: true,
    productType: true,
  })

  const priceInputRef = useRef<HTMLInputElement>(null)
  const maxPriceInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Apply filters
    let filteredProducts = [...allProducts]

    // Apply URL params first
    if (categoryParam) {
      filteredProducts = filteredProducts.filter((product) => product.category === categoryParam)
    }

    if (genderParam) {
      filteredProducts = filteredProducts.filter(
        (product) => product.gender === genderParam.toLowerCase() || product.gender === "unisex",
      )
    }

    if (frameTypeParam) {
      filteredProducts = filteredProducts.filter(
        (product) => product.frameType === frameTypeParam.toLowerCase().replace("-", "-"),
      )
    }

    if (brandParam) {
      filteredProducts = filteredProducts.filter((product) => product.brand.toLowerCase() === brandParam.toLowerCase())
    }

    if (topPickParam) {
      // This would need more complex logic in a real app
      // For now, we'll just filter by category as a placeholder
      filteredProducts = filteredProducts.filter((product) => product.category === topPickParam)
    }

    // Filter by category
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => filters.categories.includes(product.category))
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Filter by frame shape
    if (filters.frameShape !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.frameShape === filters.frameShape)
    }

    // Filter by gender
    if (filters.gender !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.gender === filters.gender || product.gender === "unisex",
      )
    }

    // Filter by frame type
    if (filters.frameType !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.frameType === filters.frameType)
    }

    // Filter by color
    if (filters.color !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.color === filters.color)
    }

    // Filter by brand
    if (filters.brand !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.brand === filters.brand)
    }

    // Filter by material
    if (filters.material !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.material === filters.material)
    }

    // Filter by weight
    if (filters.weight !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.weight === filters.weight)
    }

    // Filter by prescription type
    if (filters.prescriptionType !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.prescriptionType === filters.prescriptionType)
    }

    // Filter by frame width
    if (filters.frameWidth !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.frameWidth === filters.frameWidth)
    }

    // Filter by product type
    if (filters.productType !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.productType === filters.productType)
    }

    // Filter by size
    if (filters.size !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.size === filters.size)
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // In a real app, you would sort by date
        // Here we'll just reverse the array as a placeholder
        filteredProducts.reverse()
        break
      default:
        // Featured - keep default order
        break
    }

    setProducts(filteredProducts)
  }, [filters, categoryParam, genderParam, frameTypeParam, brandParam, topPickParam])

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }

  const handlePriceRangeChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: value }))

    // Update input fields
    if (priceInputRef.current) {
      priceInputRef.current.value = value[0].toString()
    }

    if (maxPriceInputRef.current) {
      maxPriceInputRef.current.value = value[1].toString()
    }
  }

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number.parseInt(e.target.value) || 0
    setFilters((prev) => {
      const newPriceRange = [...prev.priceRange]
      newPriceRange[index] = value
      return { ...prev, priceRange: newPriceRange }
    })
  }

  const handleFrameShapeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, frameShape: value }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [8000, 22000],
      frameShape: "all",
      searchQuery: "",
      sortBy: "featured",
      gender: "all",
      frameType: "all",
      color: "all",
      brand: "all",
      material: "all",
      weight: "all",
      prescriptionType: "all",
      frameWidth: "all",
      productType: "all",
      size: "all",
    })
  }

  // Update the filter section rendering to match the requested layout
  // Replace the existing filter sections rendering with this enhanced version

  // In the filter sections area:
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className={`md:w-1/4 space-y-6 ${mobileFiltersOpen ? "block" : "hidden md:block"}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <div
                  className="filter-heading flex justify-between items-center cursor-pointer mb-4"
                  onClick={() => toggleSection("priceRange")}
                >
                  <h3 className="font-medium">PRICE RANGE</h3>
                  {expandedSections.priceRange ? (
                    <ChevronUp className="h-4 w-4 option-icon" />
                  ) : (
                    <ChevronDown className="h-4 w-4 option-icon" />
                  )}
                </div>

                {expandedSections.priceRange && (
                  <div className="filter-options space-y-4">
                    <div className="container6">
                      <Slider
                        value={filters.priceRange}
                        min={8000}
                        max={25000}
                        step={100}
                        className="my-6 slider-track"
                        onValueChange={handlePriceRangeChange}
                      />
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center left-value">
                          <span className="text-sm mr-2">KSh</span>
                          <Input
                            ref={priceInputRef}
                            type="number"
                            className="w-20 h-8 thumb thumb--left"
                            defaultValue={filters.priceRange[0]}
                            onChange={(e) => handlePriceInputChange(e, 0)}
                            min={0}
                            max={filters.priceRange[1]}
                          />
                        </div>
                        <span className="text-sm">to</span>
                        <div className="flex items-center right-value">
                          <span className="text-sm mr-2">KSh</span>
                          <Input
                            ref={maxPriceInputRef}
                            type="number"
                            className="w-20 h-8 thumb thumb--right"
                            defaultValue={filters.priceRange[1]}
                            onChange={(e) => handlePriceInputChange(e, 1)}
                            min={filters.priceRange[0]}
                            max={300}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Category Filter */}
              <div className="filter-section">
                <div
                  className="filter-heading flex justify-between items-center cursor-pointer mb-4"
                  onClick={() => toggleSection("category")}
                >
                  <h3 className="font-medium">CATEGORY</h3>
                  {expandedSections.category ? (
                    <ChevronUp className="h-4 w-4 option-icon" />
                  ) : (
                    <ChevronDown className="h-4 w-4 option-icon" />
                  )}
                </div>

                {expandedSections.category && (
                  <div className="filter-options space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="prescription"
                        checked={filters.categories.includes("prescription")}
                        onCheckedChange={() => handleCategoryChange("prescription")}
                      />
                      <Label htmlFor="prescription">Prescription Glasses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sunglasses"
                        checked={filters.categories.includes("sunglasses")}
                        onCheckedChange={() => handleCategoryChange("sunglasses")}
                      />
                      <Label htmlFor="sunglasses">Sunglasses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reading"
                        checked={filters.categories.includes("reading")}
                        onCheckedChange={() => handleCategoryChange("reading")}
                      />
                      <Label htmlFor="reading">Reading Glasses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="blue-light"
                        checked={filters.categories.includes("blue-light")}
                        onCheckedChange={() => handleCategoryChange("blue-light")}
                      />
                      <Label htmlFor="blue-light">Blue Light Glasses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fashion"
                        checked={filters.categories.includes("fashion")}
                        onCheckedChange={() => handleCategoryChange("fashion")}
                      />
                      <Label htmlFor="fashion">Fashion Frames</Label>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Dynamic Filter Sections */}
              {filterSections.map((section) => (
                <div key={section.id} className="filter-section">
                  <div
                    className="filter-heading flex justify-between items-center cursor-pointer mb-4"
                    onClick={() => toggleSection(section.id)}
                  >
                    <h3 className="font-medium">{section.title}</h3>
                    {expandedSections[section.id] ? (
                      <ChevronUp className="h-4 w-4 option-icon" />
                    ) : (
                      <ChevronDown className="h-4 w-4 option-icon" />
                    )}
                  </div>

                  {expandedSections[section.id] && (
                    <div className="filter-options space-y-2">
                      <RadioGroup
                        value={filters[section.id as keyof typeof filters] as string}
                        onValueChange={(value) => handleFilterChange(section.id, value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id={`${section.id}-all`} />
                          <Label htmlFor={`${section.id}-all`}>All</Label>
                        </div>

                        {section.options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${section.id}-${option.value}`} />
                            <Label htmlFor={`${section.id}-${option.value}`}>{option.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  <Separator className="my-4" />
                </div>
              ))}
            </div>

            <div className="md:w-3/4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <h1 className="text-3xl font-bold">All Frames</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 md:hidden"
                      onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                    <div className="hidden md:block">
                      <Input
                        placeholder="Search frames..."
                        className="w-[200px] h-8"
                        value={filters.searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                  <select
                    className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={filters.sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold mb-2">No products found</h2>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <CardHeader className="p-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="object-cover w-full aspect-square"
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="text-sm font-medium">KSh {product.price}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full">Add to Cart</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
