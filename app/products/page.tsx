"use client"

import React, { useState, useEffect } from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ChevronDown, ChevronUp, Heart, Eye } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
// import { Slider } from "@/components/ui/slider" // Temporarily removed due to infinite loop issues
import { useCart } from "@/hooks/use-modern-cart"
import { useToast } from "@/hooks/use-toast"
import { useWishlist } from "@/hooks/use-modern-wishlist"
import { ModernProductCard } from "@/components/modern-product-card"

// Product type for type safety

interface Product {
  _id: string
  name: string
  price: number
  sale_price?: number
  mrp?: number
  category: string
  image?: string
  images?: string[] // Added missing images array field
  description?: string
  product_description?: string // From bulk upload
  short_technical_information?: string // From bulk upload
  long_technical_information?: string // From bulk upload
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
  // Additional image fields from bulk upload
  "IMAGE 1"?: string
  "IMAGE 2"?: string
  "IMAGE 3"?: string
  "IMAGE 4"?: string
  "IMAGE 5"?: string
}

// Update the interface for the Category type to match our enhanced structure
interface Category {
  id: string
  title: string
  options: { value: string; label: string; colorCode?: string }[]
}

// Update the filter sections to match the requested layout

const filterSections: Category[] = [
  {
    id: "price-range",
    title: "PRICE RANGE",
    options: [], // This is handled separately with the slider
  },
  {
    id: "category",
    title: "CATEGORY",
    options: [
      { value: "eyeglasses", label: "Eyeglasses" },
      { value: "sunglasses", label: "Sunglasses" }
    ]
  },
  {
    id: "color",
    title: "COLOR",
    options: [
      { value: "red", label: "RED", colorCode: "C1" },
      { value: "brown", label: "BROWN", colorCode: "C2" },
      { value: "blue", label: "BLUE", colorCode: "C3" },
      { value: "black-silver", label: "BLACK-SILVER", colorCode: "C4" },
      { value: "red-gold", label: "RED-GOLD", colorCode: "C5" },
      { value: "brown-gold", label: "BROWN-GOLD", colorCode: "C6" },
      { value: "aqua-blue", label: "AQUA BLUE", colorCode: "C7" },
      { value: "black", label: "BLACK", colorCode: "C8" },
      { value: "purple", label: "PURPLE", colorCode: "C9" },
      { value: "light-pink", label: "LIGHT-PINK", colorCode: "C10" },
      { value: "dark-blue-purple-gold", label: "DARK BLUE-PURPLE-GOLD" }
    ]
  },
  {
    id: "size",
    title: "SIZE",
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" }
    ]
  },
  {
    id: "material",
    title: "MATERIAL",
    options: [
      { value: "stainless-steel", label: "Stainless Steel" },
      { value: "acetate", label: "Acetate" },
      { value: "acetate-stainless-steel", label: "Acetate-Stainless Steel" },
      { value: "ultem", label: "Ultem" },
      { value: "stainless-steel-acetate", label: "Stainless Steel & Acetate" },
      { value: "tr90", label: "TR90" },
      { value: "polycarbonate", label: "Polycarbonate" }
    ]
  },
  {
    id: "shape",
    title: "SHAPE",
    options: [
      { value: "aviator", label: "Aviator" },
      { value: "rectangle", label: "Rectangle" },
      { value: "square", label: "Square" },
      { value: "round", label: "Round" },
      { value: "geometric", label: "Geometric" },
      { value: "cat-eye", label: "Cat-Eye" },
      { value: "wayfarer", label: "Wayfarer" },
      { value: "oval", label: "Oval" }
    ]
  },
  {
    id: "prescriptionType",
    title: "PRESCRIPTION TYPE",
    options: [
      { value: "single-vision", label: "Single Vision" },
      { value: "bifocal", label: "Bifocal" },
      { value: "progressive", label: "Progressive" }
    ]
  },
  {
    id: "productType",
    title: "PRODUCT TYPE",
    options: [
      { value: "eyeglasses", label: "Eyeglasses" },
      { value: "sunglasses", label: "Sunglasses" },
      { value: "contact-lens", label: "Contact Lens" },
      { value: "reading-glasses", label: "Reading Glasses" },
      { value: "accessories", label: "Accessories" },
      { value: "powered-sunglasses", label: "Powered Sunglasses" },
      { value: "zero-power", label: "Zero Power Glasses/Screen glasses" }
    ]
  },
  {
    id: "frameType",
    title: "FRAME TYPE",
    options: [
      { value: "full-rim", label: "Full Rim" },
      { value: "rimless", label: "Rimless" },
      { value: "half-rim", label: "Half Rim" }
    ]
  },
  {
    id: "brands",
    title: "BRANDS",
    options: [
      { value: "fashionista-classic", label: "Fashionista Classic" },
      { value: "magneto-classic", label: "Magneto Classic" },
      { value: "magneto-premium", label: "Magneto Premium" },
      { value: "fashionista-premium", label: "Fashionista Premium" }
    ]
  },
  {
    id: "gender",
    title: "GENDER",
    options: [
      { value: "women", label: "Women" },
      { value: "men", label: "Men" },
      { value: "unisex", label: "Unisex" }
    ]
  },
  {
    id: "ageGroup",
    title: "AGE GROUP",
    options: [
      { value: "adult", label: "Adult" },
      { value: "kids", label: "Kids" }
    ]
  },
  {
    id: "weightGroup",
    title: "WEIGHT GROUP",
    options: [
      { value: "light", label: "Light" },
      { value: "average", label: "Average" }
    ]
  },
  {
    id: "eyeglassesCollection",
    title: "EYEGLASSES COLLECTION",
    options: [
      { value: "executive-edit", label: "Executive Edit" },
      { value: "everyday-comfort", label: "Everyday Comfort" },
      { value: "modern-minimal", label: "Modern Minimal" },
      { value: "bold-patterns", label: "Bold Patterns" },
      { value: "youth-trends", label: "Youth Trends" },
      { value: "acetate-classics", label: "Acetate Classics" },
      { value: "urban-steel", label: "Urban Steel" },
      { value: "matte-classics", label: "Matte Classics" }
    ]
  },
  {
    id: "sunglassesCollection",
    title: "SUNGLASSES COLLECTION",
    options: [
      { value: "blue-sky-edit", label: "Blue Sky Edit" },
      { value: "retro-vibes", label: "Retro Vibes" },
      { value: "coastal-breeze", label: "Coastal Breeze" },
      { value: "safari-explorer", label: "Safari Explorer" },
      { value: "bold-frames", label: "Bold Frames" },
      { value: "wedding-luxe", label: "Wedding Luxe" },
      { value: "matte-glow", label: "Matte Glow" }
    ]
  }
];


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

interface FiltersState {
  categories: string[];
  priceRange: [number, number];
  searchQuery: string;
  sortBy: string;
  frameShape?: string;
  [key: string]: string[] | [number, number] | string | undefined; // Index signature
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Define slider constants
const SLIDER_MIN_PRICE = 0;
const SLIDER_MAX_PRICE = 100000;
const SLIDER_STEP = 100;

export default function ProductsPage() {
const [bannerError, setBannerError] = useState(false);

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
      banner: "/images/Eye-Glasses/clem-onojeghuo-TI-mxzGbsmk-unsplash.jpg",
    },
    sunglasses: {
      title: "Sun Glasses for Every Adventure",
      description: "Protect your eyes in style with our range of UV-protected sunglasses. Perfect for any occasion.",
      banner: "/images/Sun Glasses/aviator-sunglasses.jpg",
    },
    screenglasses: {
      title: "Screen Glasses for Digital Life",
      description: "Reduce eye strain and look great with our blue-light filtering screen glasses.",
      banner: "images/Screen Glasses/screenglasses-banner.jpg",
    },
    kidsglasses: {
      title: "Kids Glasses – Fun & Safe",
      description: "Flexible, impact-resistant, and colorful glasses designed just for kids.",
      banner: "images/Kids Glasses/frank-mckenna-LhOjrOlcLx4-unsplash.jpg",
    },
    contactlenses: {
      title: "Sun Glasses for Every Adventure",
      description: "Protect your eyes in style with our range of UV-protected sunglasses. Perfect for any occasion.",
      banner: "/images/Sun Glasses/aviator-sunglasses.jpg",
    },
  };

  const currentCategorySlug = categoryParam.toLowerCase();
  const dbCategories = React.useMemo(() => getDbCategoriesFromNav(currentCategorySlug), [currentCategorySlug]);
  const hero = categoryContent[currentCategorySlug] || {
    title: "All Products",
    description: "Browse our full collection of eyewear and accessories.",
    banner: "/placeholder.jpg",
  };  const cart = useCart()
  const { toast } = useToast()
  const wishlist = useWishlist()
  
  const [isClient, setIsClient] = useState(false)
  const [filters, setFilters] = useState<FiltersState>(() => {
  // Initialize with all filter sections as empty arrays
  const initialFilters: FiltersState = {
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 100000],
    searchQuery: "",
    sortBy: "featured",
  };

  // Add all filter sections from filterSections
  filterSections.forEach(section => {
    if (section.id !== "price-range") { // Skip price-range as it's already handled
      initialFilters[section.id] = [];
    }
  });
  return initialFilters;
});

  // Build API URL with filter parameters
  const apiUrl = React.useMemo(() => {
    // Return null during server-side rendering to prevent window access
    if (!isClient) return null;
    
    // Only create URL when running in client-side environment
    const url = new URL("/api/eyewear-products", window.location.origin);
    
    // Add category filters
    if (filters?.categories?.length) {
      url.searchParams.append("category", filters.categories.join(","));
    }
    
    // Add price range filters
    if (filters?.priceRange) {
      url.searchParams.append("priceMin", String(filters.priceRange[0]));
      url.searchParams.append("priceMax", String(filters.priceRange[1]));
    }
    
    // Add search query
    if (filters?.searchQuery) {
      url.searchParams.append("search", filters.searchQuery);
    }
    
    // Add sort parameter
    if (filters?.sortBy) {
      url.searchParams.append("sort", filters.sortBy);
    }
    
    // Add other dynamic filters
    Object.entries(filters).forEach(([key, value]) => {
      if (
        key !== 'categories' && 
        key !== 'priceRange' && 
        key !== 'searchQuery' && 
        key !== 'sortBy' &&
        Array.isArray(value) && 
        value.length > 0
      ) {
        url.searchParams.append(key, value.join(","));
      }
    });
    
    return url.toString();
  }, [filters, isClient]);
  
  const { data: allProducts = [], error, isLoading } = useSWR(
    apiUrl,
    fetcher,
    { refreshInterval: 3000 }
  )
  
  // Defensive: always use a memoized value for Slider
  // const sliderValue = React.useMemo(() => [filters.priceRange[0], filters.priceRange[1]], [filters.priceRange[0], filters.priceRange[1]])

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
  filterSections.reduce((acc, section) => {
    acc[section.id] = false; // Start all closed by default
    return acc;
  }, {} as Record<string, boolean>)
);


  // Client-side hydration flag
  useEffect(() => {
    setIsClient(true)
  }, [])
  // Use server-filtered products directly - the API handles all filtering now
  const filteredProducts = React.useMemo(() => {
    if (!isClient || !allProducts.length) return [];
      // Debug logging to check product data
    console.log("🔍 Raw product data from API:", allProducts[0]);
    console.log("🔍 Total products:", allProducts.length);
    
    // Check if products have image data
    if (allProducts.length > 0) {
      console.log("🔍 First product image data:", {
        image: allProducts[0]?.image,
        images: allProducts[0]?.images,
        imageFields: {
          'IMAGE 1': allProducts[0]?.['"IMAGE 1"'] || allProducts[0]?.['IMAGE 1'],
          'IMAGE 2': allProducts[0]?.['"IMAGE 2"'] || allProducts[0]?.['IMAGE 2'],
        }
      });
    }
    
    // Transform and normalize product data for display
    return allProducts.map((product: any) => {      // Extract and normalize image data
      const extractImages = (product: any): string[] => {
        const images: string[] = [];
        
        console.log(`🖼️ Extracting images for product: ${product.name}`, {
          productId: product._id,
          image: product.image,
          images: product.images,
          imageFieldsRaw: {
            'IMAGE 1': product['IMAGE 1'],
            'IMAGE 2': product['IMAGE 2'],
            'IMAGE 3': product['IMAGE 3'],
          }
        });
        
        // Check for primary image field
        if (product.image) {
          images.push(product.image);
          console.log(`✅ Found primary image: ${product.image}`);
        }
        
        // Check for images array
        if (product.images && Array.isArray(product.images)) {
          images.push(...product.images);
          console.log(`✅ Found images array:`, product.images);
        }
        
        // Check for individual image fields (IMAGE 1, IMAGE 2, etc.)
        for (let i = 1; i <= 5; i++) {
          const imageField = product[`IMAGE ${i}`];
          if (imageField && typeof imageField === 'string') {
            images.push(imageField);
          }
        }
        
        // Check data object for additional images
        if (product.data && typeof product.data === 'object') {
          for (let i = 1; i <= 5; i++) {
            const imageField = product.data[`IMAGE ${i}`];
            if (imageField && typeof imageField === 'string') {
              images.push(imageField);
            }
          }
        }
          // Remove duplicates and invalid images
        const uniqueImages = [...new Set(images)]
          .filter(img => img && img.trim() !== '')
          .map(img => {
            // Ensure image paths start with /
            if (!img.startsWith('/')) {
              return `/images/eyewear-products/${img}`;
            }
            return img;
          });
        
        console.log(`🎯 Final processed images for ${product.name}:`, uniqueImages);
        
        return uniqueImages.length > 0 ? uniqueImages : ['/placeholder.svg'];
      };
      
      const productImages = extractImages(product);
      const primaryImage = productImages[0];
        // Normalize price data - prioritize sale_price over regular price
      const displayPrice = product.sale_price || product.price || 0;
      const originalPrice = product.mrp || product.price || displayPrice;
      
      // Debug pricing data
      if (product.sale_price || product.mrp) {
        console.log(`💰 Pricing for ${product.name}:`, {
          raw_price: product.price,
          raw_sale_price: product.sale_price,
          raw_mrp: product.mrp,
          computed_displayPrice: displayPrice,
          computed_originalPrice: originalPrice
        });
      }
      
      return {
        ...product,
        image: primaryImage,
        images: productImages,
        price: displayPrice,
        mrp: originalPrice,
        sale_price: product.sale_price || displayPrice,
        name: product.name || product.product_title || product.title || 'Unnamed Product',
        description: product.description || product.product_description || '',
        category: product.category || 'eyewear'
      };
    });
  }, [isClient, allProducts]);

  const handleCategoryChange = React.useCallback((category: string) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }, []);

 // const handleFilterChange = React.useCallback((filterType: string, value: string) => {
   // setFilters((prev) => ({ ...prev, [filterType]: value }));
 // }, []);
 const handleCheckboxChange = React.useCallback((filterKey: string, value: string) => {
  setFilters(prev => {
    // Special case for "All" checkbox
    if (value === "all") {
      return { ...prev, [filterKey]: [] };
    }

    const currentValues = prev[filterKey] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value) // Remove if already selected
      : [...currentValues, value]; // Add if not selected

    return { ...prev, [filterKey]: newValues };
  });
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
 // const createFilterHandler = React.useCallback((sectionId: string) => {
  //  return (value: string) => handleFilterChange(sectionId, value);
 // }, [handleFilterChange]);

  // Memoize filter handlers for each section
 // const filterHandlers = React.useMemo(() => {
 //   return filterSections.reduce((acc, section) => {
 //     acc[section.id] = createFilterHandler(section.id);
 //     return acc;
//    }, {} as Record<string, (value: string) => void>);
 // }, [createFilterHandler]);

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
  const resetState: FiltersState = {
    categories: [],
    priceRange: [0, 100000],
    searchQuery: "",
    sortBy: "featured",
  };

  filterSections.forEach(section => {
    if (section.id !== "price-range") {
      resetState[section.id] = [];
    }
  });

  setFilters(resetState);
}, []);

  // Update the filter section rendering to match the requested layout
  // Replace the existing filter sections rendering with this enhanced version

  // In the filter sections area:
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Banner */}
      <main className="flex flex-col lg:flex-row min-h-screen px-2 sm:px-4 lg:px-0 m-0 -mt-[150px]">
        {/* Mobile Filter Overlay */}
        {mobileFiltersOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
        )}
        
        {/* Filter Sidebar - Left */}
        <aside
          className={`
            fixed lg:static top-0 left-0 w-[280px] sm:w-[320px] h-full lg:h-auto
            p-3 sm:p-4 bg-white border-r border-gray-200 space-y-4 sm:space-y-6 
            overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out
            ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Filters</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileFiltersOpen(false)}
              className="p-1"
            >
              ✕
            </Button>
          </div>          {/* Desktop Filter Header */}
          <div className="hidden lg:flex items-center justify-between">
            <h2 className="text-xl font-semibold">Filters</h2>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          </div>
              <Separator />              {/* Price Range Filter */}
              <div className="filter-section">
                <div
                  className="filter-heading flex justify-between items-center cursor-pointer mb-3 sm:mb-4"
                  onClick={() => toggleSection("priceRange")}
                >
                  <h3 className="font-medium text-sm sm:text-base">PRICE RANGE</h3>
                  {expandedSections.priceRange ? (
                    <ChevronUp className="h-4 w-4 option-icon" />
                  ) : (
                    <ChevronDown className="h-4 w-4 option-icon" />
                  )}
                </div>

                {expandedSections.priceRange && (
                  <div className="filter-options space-y-3 sm:space-y-4">
                    <div className="container6">
                      {/* Simple dual range input approach */}
                      <div className="space-y-3 sm:space-y-4">
                        <div className="text-center text-xs sm:text-sm text-muted-foreground">
                          Price Range: KSh {filters.priceRange[0].toLocaleString()} - KSh {filters.priceRange[1].toLocaleString()}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-medium">Minimum Price</label>
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
                          <label className="text-xs sm:text-sm font-medium">Maximum Price</label>
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

                      <div className="flex items-center justify-between gap-2 sm:gap-4 mt-3 sm:mt-4">
                        <div className="flex items-center left-value">
                          <span className="text-xs sm:text-sm mr-1 sm:mr-2">KSh</span>
                          <Input
                            type="number"
                            className="w-16 sm:w-20 h-7 sm:h-8 thumb thumb--left text-xs sm:text-sm"
                            value={filters.priceRange[0]} // Controlled by state
                            onChange={(e) => handlePriceInputChange(e, 0)}
                            min={SLIDER_MIN_PRICE}
                            max={filters.priceRange[1]} // Max is dynamic based on other thumb
                            step={SLIDER_STEP} // Add step to input for browser behavior
                          />
                        </div>
                        <span className="text-xs sm:text-sm">to</span>
                        <div className="flex items-center right-value">
                          <span className="text-xs sm:text-sm mr-1 sm:mr-2">KSh</span>
                          <Input
                            type="number"
                            className="w-16 sm:w-20 h-7 sm:h-8 thumb thumb--right text-xs sm:text-sm"
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

              <Separator />              {/* Category Filter */}
              <div className="filter-section">
                <div
                  className="filter-heading flex justify-between items-center cursor-pointer mb-3 sm:mb-4"
                  onClick={() => toggleSection("category")}
                >
                  <h3 className="font-medium text-sm sm:text-base">CATEGORY</h3>
                  {expandedSections.category ? (
                    <ChevronUp className="h-4 w-4 option-icon" />
                  ) : (
                    <ChevronDown className="h-4 w-4 option-icon" />
                  )}
                </div>

               {expandedSections.category && (
  <div className="filter-options space-y-2">
    {[
      { id: "prescription", label: "Prescription Glasses" },
      { id: "sunglasses", label: "Sunglasses" },
      { id: "reading", label: "Reading Glasses" },
      { id: "blue-light", label: "Blue Light Glasses" },
      { id: "fashion", label: "Fashion Frames" }
    ].map((item) => (
      <div key={item.id} className="flex items-center space-x-2">
        <Checkbox
          id={item.id}
          checked={filters.categories.includes(item.id)}
          onCheckedChange={() => handleCheckboxChange("categories", item.id)}
        />
        <Label htmlFor={item.id} className="text-xs sm:text-sm">{item.label}</Label>
      </div>
    ))}
  </div>
)}
              </div>

              <Separator />              {/* Dynamic Filter Sections */}
 {filterSections.map((section) => (
  <div key={section.id} className="filter-section">
    <div
      className="filter-heading flex justify-between items-center cursor-pointer mb-3 sm:mb-4"
      onClick={() => toggleSection(section.id)}
    >
      <h3 className="font-medium text-sm sm:text-base">{section.title}</h3>
      {expandedSections[section.id] ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </div>

    {expandedSections[section.id] && (
      <div className="filter-options space-y-2">
        {section.id === "price-range" ? (
          // Price range slider (keep your existing implementation)
          <div className="space-y-4">
            {/* Your price range slider UI */}
          </div>
        ) : (
          <>
            {/* "All" checkbox */}
            <div className="flex items-center space-x-2">
  <Checkbox    id={`${section.id}-all`}
    checked={((filters[section.id] as string[]) || []).length === 0}
    onCheckedChange={() => handleCheckboxChange(section.id, "all")}
  />
  <Label htmlFor={`${section.id}-all`} className="text-xs sm:text-sm">All</Label>
</div>

            {/* Filter options */}
           {section.options.map((option) => (
  <div key={option.value} className="flex items-center space-x-2">    <Checkbox
      id={`${section.id}-${option.value}`}
      checked={(filters[section.id] as string[] || []).includes(option.value)}
      onCheckedChange={() => handleCheckboxChange(section.id, option.value)}
    />
    <Label htmlFor={`${section.id}-${option.value}`} className="flex items-center text-xs sm:text-sm">
      {option.label}
      {option.colorCode && (
        <span
          className="ml-2 w-3 h-3 rounded-full inline-block border"
          style={{ backgroundColor: option.colorCode.startsWith('#') 
            ? option.colorCode 
            : `#${option.colorCode}` }}
        />
      )}
    </Label>
  </div>
))}
          </>
        )}
      </div>
    )}
    <Separator className="my-3 sm:my-4" />
  </div>
))}

              </aside>              {/* Product Section */}
           {/* Product Listing - Right */}
        <section className="flex-1 px-2 sm:px-4 py-3 sm:py-6 flex flex-col h-full lg:h-screen">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-4 flex-shrink-0">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">All Frames</h1>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 lg:hidden flex-1 sm:flex-none"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
                      <Filter className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Filter</span>
          </Button>
          <div className="hidden sm:block flex-1 sm:flex-none">
            <Input
              placeholder="Search frames..."
              className="w-full sm:w-[300px] lg:w-[500px] h-8 text-sm"
              value={filters.searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {/* Mobile Search - Full Width */}
        <div className="block sm:hidden w-full">
          <Input
            placeholder="Search frames..."
            className="w-full h-8 text-sm"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <select
          className="h-8 rounded-md border border-input bg-background py-1 px-2 text-xs sm:text-sm w-full sm:w-auto"
          value={filters.sortBy}          onChange={handleSortChange}
        >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>              
              
              {/* Scrollable Product Container */}
              <div className="flex-1 overflow-y-auto">
                {(filteredProducts.length === 0 || !isClient) ? (
                  <div className="text-center text-muted-foreground py-8 sm:py-12">
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4 px-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-600">
                          {!isClient ? "Loading..." : "No products found"}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 max-w-xs sm:max-w-sm mx-auto">
                          {!isClient ? "Please wait while we load the products" : "Try adjusting your filters or search terms"}
                        </p>
                      </div>
                      {isClient && (
                        <Button variant="outline" onClick={resetFilters} size="sm">
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4 lg:gap- pb-4 sm:pb-6">
                    {filteredProducts.map((product: Product) => (                      <ModernProductCard
                        key={product._id}
                        product={{
                          _id: product._id,
                          name: product.name,
                          price: product.price,
                          sale_price: product.sale_price,
                          mrp: product.mrp,
                          category: (product.category as "prescription" | "sunglasses" | "reading") || "prescription",
                          image: product.image,
                          images: product.images || [],
                          colors: product.color ? [{name: product.color, code: product.color, image: product.image || ''}] : [],
                          inStock: true,
                          description: product.description || product.product_description || '',
                          rating: 4 + Math.random(), // Random rating for demo
                          reviews: Math.floor(Math.random() * 100) + 1,
                          isNew: Math.random() > 0.8, // 20% chance of being new
                          discount: product.sale_price && product.mrp ? Math.round(((product.mrp - product.sale_price) / product.mrp) * 100) : 0
                        }}
                        variant="default"
                        showQuickActions={true}
                        className="h-full"
                      />
                    ))}                  </div>
                )}
              </div>
          
         </section>
        </main>
      </div>
    )
  }
