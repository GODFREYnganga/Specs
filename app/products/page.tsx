"use client"

import React, { useState, useEffect } from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ChevronDown, ChevronUp, Heart, Eye } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
// import { Slider } from "@/components/ui/slider" // Temporarily removed due to infinite loop issues
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useWishlist } from "@/hooks/use-wishlist"
import { ModernProductCard } from "@/components/modern-product-card"

// Product type for type safety
interface Product {
  _id: string
  name: string
  price: number
  category: string
  image?: string
  description?: string
  frameShape?: string
  frameType?: string
  gender?: string
  material?: string
  weight?: string
  prescriptionType?: string
  frameWidth?: string
  productType?: string
  color?: string
  brand?: string
  size?: string
}

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

// Updated mapping from navbar slugs to DB category values
// Maps our 5 navigation categories to arrays of database categories
const NAVBAR_CATEGORY_MAP: Record<string, string[]> = {
  "eye-glasses": ["prescription", "reading", "fashion"], // Eye Glasses includes prescription, reading, fashion
  "blue-light-glasses": ["blue-light"], // Blue Light Glasses 
  "sunglasses": ["sunglasses"], // Sunglasses
  "kids-glasses": ["prescription", "reading", "fashion", "blue-light"], // Kids can use all frame types
  "services": ["contact-lenses"], // Services category (would need separate handling)
}

// Helper function to get database categories from navigation category
const getDbCategoriesFromNav = (navCategory: string): string[] => {
  return NAVBAR_CATEGORY_MAP[navCategory] || [navCategory]
}

interface FilterSection {
  id: string
  title: string
  options: { value: string; label: string }[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Define slider constants
const SLIDER_MIN_PRICE = 0;
const SLIDER_MAX_PRICE = 100000;
const SLIDER_STEP = 100;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get category and other filter params from searchParams
  const categoryParam = searchParams.get("category") || "";
  const genderParam = searchParams.get("gender") || "";
  const frameTypeParam = searchParams.get("frameType") || "";
  const brandParam = searchParams.get("brand") || "";
  const topPickParam = searchParams.get("topPick") || "";

  // Hero/banner content by category
  const categoryContent: Record<string, { title: string; description: string; banner: string }> = {
    eyeglasses: {
      title: "Discover Stylish Eye Glasses",
      description: "Shop our curated collection of premium eyeglasses. Lightweight, durable, and designed for comfort and style.",
      banner: "/images/Eye Glasses/clem-onojeghuo-TI-mxzGbsmk-unsplash.jpg",
    },
    sunglasses: {
      title: "Sun Glasses for Every Adventure",
      description: "Protect your eyes in style with our range of UV-protected sunglasses. Perfect for any occasion.",
      banner: "/images/Sun Glasses/aviator-sunglasses.jpg",
    },
    screenglasses: {
      title: "Screen Glasses for Digital Life",
      description: "Reduce eye strain and look great with our blue-light filtering screen glasses.",
      banner: "/images/Screen Glasses/2h-media-HifdOfMgSls-unsplash.jpg",
    },
    kidsglasses: {
      title: "Kids Glasses – Fun & Safe",
      description: "Flexible, impact-resistant, and colorful glasses designed just for kids.",
      banner: "/images/Kids Glasses/frank-mckenna-LhOjrOlcLx4-unsplash.jpg",
    },
    contactlenses: {
      title: "Contact Lenses – All-Day Comfort",
      description: "Experience clear vision and comfort with our premium contact lenses.",
      banner: "/images/Contact Lenses/IMG-20250604-WA0006.jpg",
    },
  };

  const currentCategorySlug = categoryParam.toLowerCase();
  const dbCategories = React.useMemo(() => getDbCategoriesFromNav(currentCategorySlug), [currentCategorySlug]);

  const hero = categoryContent[currentCategorySlug] || {
    title: "All Products", 
    description: "Browse our full collection of eyewear and accessories.",
    banner: "/placeholder.jpg",
  };

  const { addToCart } = useCart()
  const { toast } = useToast()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()

  const { data: allProducts = [], error, isLoading } = useSWR(
    "/api/products",
    fetcher,
    { refreshInterval: 3000 }
  )

  const [isClient, setIsClient] = useState(false)
  const [filters, setFilters] = useState({
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 100000], // Start from 0
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
  // Defensive: always use a memoized value for Slider
  // const sliderValue = React.useMemo(() => [filters.priceRange[0], filters.priceRange[1]], [filters.priceRange[0], filters.priceRange[1]])

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

  // Client-side hydration flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Use useMemo for filtering instead of useEffect to prevent infinite loops
  const filteredProducts = React.useMemo(() => {
    // Only run filtering on client side to avoid hydration mismatches
    if (!isClient || !allProducts.length) return []
    
    // Apply filters to allProducts
    let filtered = [...allProducts]

    // Filter by navigation category - use array of database categories
    if (categoryParam && dbCategories.length > 0) {
      filtered = filtered.filter((product) => dbCategories.includes(product.category))
      
      // Special handling for kids-glasses - also filter by age/gender
      if (currentCategorySlug === "kids-glasses") {
        filtered = filtered.filter((product) => 
          product.gender === "kids" || 
          product.frameWidth === "small" ||
          product.productType === "kids"
        )
      }
    }

    if (genderParam) {
      filtered = filtered.filter(
        (product) => product.gender === genderParam.toLowerCase() || product.gender === "unisex",
      )
    }

    if (frameTypeParam) {
      filtered = filtered.filter(
        (product) => product.frameType === frameTypeParam.toLowerCase().replace("-", "-"),
      )
    }

    if (brandParam) {
      filtered = filtered.filter((product) => product.brand?.toLowerCase() === brandParam.toLowerCase())
    }

    if (topPickParam) {
      filtered = filtered.filter((product) => product.category === topPickParam)
    }

    // Filter by specific category selection (sidebar filters)
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) => filters.categories.includes(product.category))
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Filter by frame shape
    if (filters.frameShape !== "all") {
      filtered = filtered.filter((product) => product.frameShape === filters.frameShape)
    }

    // Filter by gender
    if (filters.gender !== "all") {
      filtered = filtered.filter(
        (product) => product.gender === filters.gender || product.gender === "unisex",
      )
    }

    // Filter by frame type
    if (filters.frameType !== "all") {
      filtered = filtered.filter((product) => product.frameType === filters.frameType)
    }

    // Filter by color
    if (filters.color !== "all") {
      filtered = filtered.filter((product) => product.color === filters.color)
    }

    // Filter by brand
    if (filters.brand !== "all") {
      filtered = filtered.filter((product) => product.brand === filters.brand)
    }

    // Filter by material
    if (filters.material !== "all") {
      filtered = filtered.filter((product) => product.material === filters.material)
    }

    // Filter by weight
    if (filters.weight !== "all") {
      filtered = filtered.filter((product) => product.weight === filters.weight)
    }

    // Filter by prescription type
    if (filters.prescriptionType !== "all") {
      filtered = filtered.filter((product) => product.prescriptionType === filters.prescriptionType)
    }

    // Filter by frame width
    if (filters.frameWidth !== "all") {
      filtered = filtered.filter((product) => product.frameWidth === filters.frameWidth)
    }

    // Filter by product type
    if (filters.productType !== "all") {
      filtered = filtered.filter((product) => product.productType === filters.productType)
    }

    // Filter by size
    if (filters.size !== "all") {
      filtered = filtered.filter((product) => product.size === filters.size)
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) => product.name.toLowerCase().includes(query) || (product.description?.toLowerCase() ?? "").includes(query),
      )
    }

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // In a real app, you would sort by date
        // Here we'll just reverse the array as a placeholder
        filtered.reverse()
        break
      default:
        // Featured - keep default order
        break
    }

    return filtered
  }, [
    isClient, 
    allProducts, 
    filters.categories,
    filters.priceRange,
    filters.frameShape,
    filters.searchQuery,
    filters.sortBy,
    filters.gender,
    filters.frameType,
    filters.color,
    filters.brand,
    filters.material,
    filters.weight,
    filters.prescriptionType,
    filters.frameWidth,
    filters.productType,
    filters.size,
    dbCategories, 
    genderParam, 
    frameTypeParam, 
    brandParam, 
    topPickParam, 
    categoryParam,
    currentCategorySlug
  ])

  const handleCategoryChange = React.useCallback((category: string) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }, []);

  const handleFilterChange = React.useCallback((filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  }, []);

  // Create stable callback functions for each category to prevent infinite loops
  const handlePrescriptionChange = React.useCallback((checked: boolean) => {
    handleCategoryChange("prescription");
  }, [handleCategoryChange]);
  
  const handleSunglassesChange = React.useCallback((checked: boolean) => {
    handleCategoryChange("sunglasses");
  }, [handleCategoryChange]);
  
  const handleReadingChange = React.useCallback((checked: boolean) => {
    handleCategoryChange("reading");
  }, [handleCategoryChange]);
  
  const handleBluelightChange = React.useCallback((checked: boolean) => {
    handleCategoryChange("blue-light");
  }, [handleCategoryChange]);
  
  const handleFashionChange = React.useCallback((checked: boolean) => {
    handleCategoryChange("fashion");
  }, [handleCategoryChange]);

  // Create stable callbacks for RadioGroup filters to prevent infinite loops
  const createFilterHandler = React.useCallback((sectionId: string) => {
    return (value: string) => handleFilterChange(sectionId, value);
  }, [handleFilterChange]);

  // Memoize filter handlers for each section
  const filterHandlers = React.useMemo(() => {
    return filterSections.reduce((acc, section) => {
      acc[section.id] = createFilterHandler(section.id);
      return acc;
    }, {} as Record<string, (value: string) => void>);
  }, [createFilterHandler]);

  const updatePriceRange = React.useCallback((newMinMax: [number, number]) => {
    setFilters((prevFilters) => {
      const [minVal, maxVal] = newMinMax;
      
      // Simple validation without complex snapping
      const validMin = Math.max(SLIDER_MIN_PRICE, Math.min(minVal, SLIDER_MAX_PRICE));
      const validMax = Math.max(SLIDER_MIN_PRICE, Math.min(maxVal, SLIDER_MAX_PRICE));
      
      // Ensure min <= max
      const finalMin = Math.min(validMin, validMax);
      const finalMax = Math.max(validMin, validMax);

      // Only update if values actually changed
      if (finalMin !== prevFilters.priceRange[0] || finalMax !== prevFilters.priceRange[1]) {
        return { ...prevFilters, priceRange: [finalMin, finalMax] };
      }
      return prevFilters;
    });
  }, []);

  const handleMinPriceChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    setFilters((prev) => {
      const newMax = Math.max(newMin, prev.priceRange[1]);
      return { ...prev, priceRange: [newMin, newMax] };
    });
  }, []);

  const handleMaxPriceChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    setFilters((prev) => {
      const newMin = Math.min(prev.priceRange[0], newMax);
      return { ...prev, priceRange: [newMin, newMax] };
    });
  }, []);

  const handlePriceInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const typedValue = event.target.value;
    const parsedValue = parseInt(typedValue, 10);
    
    setFilters((prevFilters) => {
      const newRange = [...prevFilters.priceRange] as [number, number];
      
      if (!isNaN(parsedValue)) {
        newRange[index] = parsedValue;
      } else if (typedValue === "") {
        newRange[index] = (index === 0) ? SLIDER_MIN_PRICE : SLIDER_MAX_PRICE;
      }
      
      // Ensure min <= max
      const [min, max] = newRange;
      const validMin = Math.max(SLIDER_MIN_PRICE, Math.min(min, SLIDER_MAX_PRICE));
      const validMax = Math.max(SLIDER_MIN_PRICE, Math.min(max, SLIDER_MAX_PRICE));
      
      return { 
        ...prevFilters, 
        priceRange: [Math.min(validMin, validMax), Math.max(validMin, validMax)] 
      };
    });
  }, []);

  const handleFrameShapeChange = React.useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, frameShape: value }));
  }, []);

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  }, []);

  const handleSortChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  }, []);

  const toggleSection = React.useCallback((sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilters({
      categories: [],
      priceRange: [0, 100000], // Start from 0
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
  }, []);

  // Update the filter section rendering to match the requested layout
  // Replace the existing filter sections rendering with this enhanced version

  // In the filter sections area:
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden mb-8">
        <img
          src={hero.banner}
          alt={hero.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        />
        <div className="relative z-10 text-center text-white bg-black/40 p-6 rounded-xl max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{hero.title}</h1>
          <p className="text-lg md:text-xl font-medium drop-shadow">{hero.description}</p>
        </div>
      </div>

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
                      {/* Simple dual range input approach */}
                      <div className="space-y-4">
                        <div className="text-center text-sm text-muted-foreground">
                          Price Range: KSh {filters.priceRange[0].toLocaleString()} - KSh {filters.priceRange[1].toLocaleString()}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Minimum Price</label>
                          <input
                            type="range"
                            min={SLIDER_MIN_PRICE}
                            max={SLIDER_MAX_PRICE}
                            step={SLIDER_STEP}
                            value={filters.priceRange[0]}
                            onChange={handleMinPriceChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Maximum Price</label>
                          <input
                            type="range"
                            min={SLIDER_MIN_PRICE}
                            max={SLIDER_MAX_PRICE}
                            step={SLIDER_STEP}
                            value={filters.priceRange[1]}
                            onChange={handleMaxPriceChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-4 mt-4">
                        <div className="flex items-center left-value">
                          <span className="text-sm mr-2">KSh</span>
                          <Input
                            type="number"
                            className="w-20 h-8 thumb thumb--left"
                            value={filters.priceRange[0]} // Controlled by state
                            onChange={(e) => handlePriceInputChange(e, 0)}
                            min={SLIDER_MIN_PRICE}
                            max={filters.priceRange[1]} // Max is dynamic based on other thumb
                            step={SLIDER_STEP} // Add step to input for browser behavior
                          />
                        </div>
                        <span className="text-sm">to</span>
                        <div className="flex items-center right-value">
                          <span className="text-sm mr-2">KSh</span>
                          <Input
                            type="number"
                            className="w-20 h-8 thumb thumb--right"
                            value={filters.priceRange[1]} // Controlled by state
                            onChange={(e) => handlePriceInputChange(e, 1)}
                            min={filters.priceRange[0]} // Min is dynamic based on other thumb
                            max={SLIDER_MAX_PRICE}
                            step={SLIDER_STEP} // Add step to input for browser behavior
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
                        onCheckedChange={handlePrescriptionChange}
                      />
                      <Label htmlFor="prescription">Prescription Glasses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sunglasses"
                        checked={filters.categories.includes("sunglasses")}
                        onCheckedChange={handleSunglassesChange}
                      />
                      <Label htmlFor="sunglasses">Sunglasses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reading"
                        checked={filters.categories.includes("reading")}
                        onCheckedChange={handleReadingChange}
                      />
                      <Label htmlFor="reading">Reading Glasses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="blue-light"
                        checked={filters.categories.includes("blue-light")}
                        onCheckedChange={handleBluelightChange}
                      />
                      <Label htmlFor="blue-light">Blue Light Glasses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fashion"
                        checked={filters.categories.includes("fashion")}
                        onCheckedChange={handleFashionChange}
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
                        onValueChange={filterHandlers[section.id]}
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

              {(filteredProducts.length === 0 || !isClient) ? (
                <div className="text-center text-muted-foreground py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Filter className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-600">
                        {!isClient ? "Loading..." : "No products found"}
                      </h3>
                      <p className="text-gray-500">
                        {!isClient ? "Please wait while we load the products" : "Try adjusting your filters or search terms"}
                      </p>
                    </div>
                    {isClient && (
                      <Button variant="outline" onClick={resetFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product: Product) => (
                    <ModernProductCard 
                      key={product._id}
                      product={{
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        category: product.category as "prescription" | "sunglasses" | "reading",
                        image: product.image,
                        images: product.image ? [product.image] : [],
                        colors: product.color ? [product.color] : [],
                        inStock: true,
                        description: product.description,
                        rating: 4 + Math.random(), // Random rating for demo
                        reviews: Math.floor(Math.random() * 100) + 1,
                        isNew: Math.random() > 0.8, // 20% chance of being new
                        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0 // 30% chance of discount
                      }}
                      variant="default"
                      showQuickActions={true}
                      className="h-full"
                    />
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
