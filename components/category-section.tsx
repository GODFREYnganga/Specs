"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Category interface defining the structure of category data
 * Includes nested subcategories for the dropdown menu
 */
interface Category {
  id: number
  name: string
  description: string
  image: string
  slug: string
  subcategories?: {
    gender?: string[]
    topPicks?: string[]
    frameTypes?: string[]
    collections?: {
      styles?: string[]
      brands?: string[]
    }
    ageGroups?: string[]
    types?: string[]
    services?: string[]
    benefits?: string[]
    seasonal?: string[]
    brands?: string[]
    occasions?: string[]
    equipment?: string[]
    professionals?: string[]
    features?: string[]
  }
}

/**
 * Sample category data with comprehensive subcategories
 * This structure allows for detailed filtering options in the UI
 */
const categories: Category[] = [
  {
    id: 1,
    name: "Eyeglasses",
    description: "Prescription & fashion frames",
    image: "/images/products/silver-round-frames.png",
    slug: "eyeglasses",
    subcategories: {
      gender: ["Men", "Women", "Kids"],
      topPicks: ["New Arrivals", "Best Sellers", "Progressive Eyeglasses"],
      frameTypes: [
        "Rectangle Frames",
        "Square Frames",
        "Round Frames",
        "Cat Eye Frames",
        "Wayfarer Frames",
        "Geometric Frames",
        "Aviator Frames",
        "Halfrim Frames",
        "Rimless Frames",
      ],
      collections: {
        styles: [
          "Matte Classics",
          "Urban Steel",
          "Acetate Classics",
          "Youth Trends",
          "Bold Patterns",
          "Modern Minimal",
          "Everyday Comfort",
          "Executive Edit",
        ],
        brands: ["Fashionista Classic", "Magneto Kids Classic", "Magneto Kids Premium"],
      },
    },
  },
  {
    id: 2,
    name: "Screen Glasses",
    description: "Protection for digital screens",
    image: "/images/products/black-blue-light-frames.png",
    slug: "screen-glasses",
    subcategories: {
      gender: ["Men", "Women", "Kids"],
      topPicks: ["Gaming", "Office", "Reading"],
      frameTypes: ["Rectangle Frames", "Round Frames", "Square Frames", "Oversized Frames"],
      collections: {
        styles: ["Digital Pro", "Screen Shield", "Night Comfort"],
        brands: ["BlueGuard", "ScreenSafe", "EyeRest"],
      },
    },
  },
  {
    id: 3,
    name: "Kids Glasses",
    description: "Durable and fun frames for children",
    image: "/images/products/clear-frames.png",
    slug: "kids-glasses",
    subcategories: {
      ageGroups: ["Toddler (2-4)", "Young (5-8)", "Pre-Teen (9-12)", "Teen (13+)"],
      topPicks: ["Flexible", "Colorful", "Sports-Ready"],
      frameTypes: ["Round Frames", "Rectangle Frames", "Oval Frames", "Character Frames"],
      collections: {
        styles: ["Playful Patterns", "Sport Active", "Study Buddy"],
        brands: ["Magneto Kids", "Junior Vision", "KidSafe"],
      },
    },
  },
  {
    id: 4,
    name: "Sunglasses",
    description: "UV protection with style",
    image: "/images/products/black-round-frames.png",
    slug: "sunglasses",
    subcategories: {
      gender: ["Men", "Women", "Kids"],
      topPicks: ["Polarized", "Mirrored", "Oversized"],
      frameTypes: [
        "Rectangle Frames",
        "Square Frames",
        "Round Frames",
        "Cat Eye Frames",
        "Wayfarer Frames",
        "Geometric Frames",
        "Aviator Frames",
        "Halfrim Frames",
        "Rimless Frames",
      ],
      collections: {
        styles: ["Beach Collection", "Urban Explorer", "Driving Series", "Luxury Line"],
        brands: ["SunPro", "RayStyle", "Coastal"],
      },
    },
  },
  {
    id: 5,
    name: "Contact Lenses",
    description: "Comfortable vision without frames",
    image: "/images/products/frame-game-collage.png",
    slug: "contact-lenses",
    subcategories: {
      types: ["Daily", "Weekly", "Monthly", "Yearly"],
      topPicks: ["Colored", "Toric", "Multifocal"],
      brands: ["Aqualens", "Bausch Lamb", "Softlens", "Acuvue", "Iconnect", "Alcon"],
      features: ["Hydrating", "Extended Wear", "UV Protection"],
    },
  },
  {
    id: 6,
    name: "Collections",
    description: "Curated frame collections",
    image: "/images/products/rose-gold-moon-frames.png",
    slug: "collections",
    subcategories: {
      styles: [
        "Matte Classics",
        "Urban Steel",
        "Acetate Classics",
        "Youth Trends",
        "Bold Patterns",
        "Modern Minimal",
        "Everyday Comfort",
        "Executive Edit",
      ],
      brands: ["Fashionista Classic", "Magneto Kids Classic", "Magneto Kids Premium"],
      seasonal: ["Summer Vibes", "Winter Elegance", "Spring Fresh", "Fall Favorites"],
      occasions: ["Office Wear", "Party Ready", "Outdoor Adventure", "Formal Events"],
    },
  },
  {
    id: 7,
    name: "Home Eye-Test",
    description: "Professional testing at home",
    image: "/images/people/eye-test-home.png",
    slug: "home-eye-test",
    subcategories: {
      services: ["Basic Vision Test", "Comprehensive Exam", "Kids Eye Check", "Contact Lens Fitting"],
      packages: ["Standard", "Premium", "Family", "Senior"],
      equipment: ["Vision Charts", "Refraction Tools", "Digital Assessment"],
      professionals: ["Optometrists", "Vision Specialists", "Pediatric Experts"],
    },
  },
  {
    id: 8,
    name: "Gold Membership",
    description: "Premium benefits and savings",
    image: "/images/products/gold-round-frames.png",
    slug: "gold-membership",
    subcategories: {
      benefits: ["15% Off All Purchases", "Free Shipping", "Priority Service", "Annual Eye Exam"],
      tiers: ["Standard Gold", "Platinum", "Diamond"],
      exclusives: ["Limited Edition Frames", "Early Access", "Member Events"],
      services: ["Personal Stylist", "Frame Adjustments", "Extended Warranty"],
    },
  },
]

/**
 * CategorySection Component
 *
 * Displays a carousel of product categories with interactive dropdown menus.
 * Features hover states and detailed subcategory navigation.
 */
export function CategorySection() {
  // State to track the current starting index of visible categories
  const [currentIndex, setCurrentIndex] = useState(0)

  // State to store the currently visible categories (subset of all categories)
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([])

  // State to track which category is currently being hovered
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)

  // State to track which subcategory section is expanded in the dropdown
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null)

  /**
   * Effect to update visible categories when the current index changes
   * Also sets up automatic rotation of categories
   */
  useEffect(() => {
    // Calculate which categories should be visible based on current index
    const startIdx = currentIndex % categories.length
    const endIdx = startIdx + 4

    // Handle wrapping around when we reach the end of the categories array
    setVisibleCategories(
      endIdx <= categories.length
        ? categories.slice(startIdx, endIdx)
        : [...categories.slice(startIdx), ...categories.slice(0, endIdx - categories.length)],
    )

    // Set up automatic rotation every 6 seconds
    const interval = setInterval(nextSlide, 6000)

    // Clean up interval on component unmount or when dependencies change
    return () => clearInterval(interval)
  }, [currentIndex])

  // Handler for next slide button
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % categories.length)

  // Handler for previous slide button
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length)

  return (
    <section className="category-section bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section header with decorative lines */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
            <h2 className="text-3xl font-bold text-gray-800 px-4">Shop by Category</h2>
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column with descriptive text */}
          <div className="lg:w-1/4">
            <p className="text-gray-800 mb-6 text-xl font-medium">Our Hottest Collections</p>
          </div>

          {/* Right column with category carousel */}
          <div className="lg:w-3/4">
            <div className="flex items-center gap-4">
              {/* Previous slide button */}
              <button
                onClick={prevSlide}
                className="p-3 rounded-full border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition shrink-0"
                aria-label="Previous category"
              >
                <ArrowLeft size={20} />
              </button>

              {/* Category cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                {visibleCategories.map((category) => (
                  <div
                    key={category.id}
                    className="category-tile group relative bg-white rounded-lg overflow-hidden shadow-sm h-64 hover:shadow-md transition-all"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => {
                      setHoveredCategory(null)
                      setHoveredSubcategory(null)
                    }}
                  >
                    {/* Category image with hover effect */}
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/20" />
                    </div>

                    {/* Category name and shop button */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                      <div className="mb-2 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <Link href={`/products?category=${category.slug}`}>
                          <Button className="bg-white  text-gray-800 hover:bg-gray-100
                          border border-gray-300
                          ">Shop Now</Button>
                        </Link>
                      </div>
                      <h3 className="font-medium text-white">{category.name}</h3>
                    </div>

                    {/* Enhanced dropdown menu that appears on hover */}
                    {hoveredCategory === category.id && category.subcategories && (
                      <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-20 p-4 animate-fadeIn">
                        <div className="grid grid-cols-1 gap-4">
                          {/* Dynamically render subcategory sections based on available data */}
                          {/* Each section is collapsible for better UX */}

                          {/* Shop by Gender section */}
                          {category.subcategories.gender && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() => setHoveredSubcategory(hoveredSubcategory === "gender" ? null : "gender")}
                              >
                                <span>Shop by Gender</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "gender" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "gender" && (
                                <div className="pl-4 space-y-1 text-sm">
                                  {category.subcategories.gender.map((gender) => (
                                    <Link
                                      key={gender}
                                      href={`/products?category=${category.slug}&gender=${gender.toLowerCase()}`}
                                      className="block text-gray-800 hover:text-teal-700"
                                    >
                                      {gender}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Age Groups (for Kids) */}
                          {category.subcategories.ageGroups && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() =>
                                  setHoveredSubcategory(hoveredSubcategory === "ageGroups" ? null : "ageGroups")
                                }
                              >
                                <span>Age Groups</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "ageGroups" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "ageGroups" && (
                                <div className="pl-4 space-y-1 text-sm">
                                  {category.subcategories.ageGroups.map((age) => (
                                    <Link
                                      key={age}
                                      href={`/products?category=${category.slug}&ageGroup=${age.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")}`}
                                      className="block text-gray-800 hover:text-teal-700"
                                    >
                                      {age}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Types (for Contact Lenses) */}
                          {category.subcategories.types && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() => setHoveredSubcategory(hoveredSubcategory === "types" ? null : "types")}
                              >
                                <span>Types</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "types" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "types" && (
                                <div className="pl-4 space-y-1 text-sm">
                                  {category.subcategories.types.map((type) => (
                                    <Link
                                      key={type}
                                      href={`/products?category=${category.slug}&type=${type.toLowerCase()}`}
                                      className="block text-gray-800 hover:text-teal-700"
                                    >
                                      {type}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Services (for Home Eye-Test) */}
                          {category.subcategories.services && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() =>
                                  setHoveredSubcategory(hoveredSubcategory === "services" ? null : "services")
                                }
                              >
                                <span>Services</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "services" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "services" && (
                                <div className="pl-4 space-y-1 text-sm">
                                  {category.subcategories.services.map((service) => (
                                    <Link
                                      key={service}
                                      href={`/products?category=${category.slug}&service=${service.toLowerCase().replace(/\s+/g, "-")}`}
                                      className="block text-gray-800 hover:text-teal-700"
                                    >
                                      {service}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Benefits (for Gold Membership) */}
                          {category.subcategories.benefits && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() =>
                                  setHoveredSubcategory(hoveredSubcategory === "benefits" ? null : "benefits")
                                }
                              >
                                <span>Benefits</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "benefits" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "benefits" && (
                                <div className="pl-4 space-y-1 text-sm">
                                  {category.subcategories.benefits.map((benefit) => (
                                    <Link
                                      key={benefit}
                                      href={`/gold-membership?highlight=${benefit.toLowerCase().replace(/\s+/g, "-").replace(/[%]/g, "")}`}
                                      className="block text-gray-800 hover:text-teal-700"
                                    >
                                      {benefit}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Top Picks */}
                          {category.subcategories.topPicks && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() =>
                                  setHoveredSubcategory(hoveredSubcategory === "topPicks" ? null : "topPicks")
                                }
                              >
                                <span>Our Top Picks</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "topPicks" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "topPicks" && (
                                <div className="pl-4 space-y-1 text-sm">
                                  {category.subcategories.topPicks.map((pick) => (
                                    <Link
                                      key={pick}
                                      href={`/products?category=${category.slug}&topPick=${pick.toLowerCase().replace(/\s+/g, "-")}`}
                                      className="block text-gray-800 hover:text-teal-700"
                                    >
                                      {pick}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Frame Types */}
                          {category.subcategories.frameTypes && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() =>
                                  setHoveredSubcategory(hoveredSubcategory === "frameTypes" ? null : "frameTypes")
                                }
                              >
                                <span>Frame Types</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "frameTypes" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "frameTypes" && (
                                <div className="pl-4 space-y-1 text-sm">
                                  {category.subcategories.frameTypes.map((type) => (
                                    <Link
                                      key={type}
                                      href={`/products?category=${category.slug}&frameType=${type.toLowerCase().replace(/\s+/g, "-")}`}
                                      className="block text-gray-800 hover:text-teal-700"
                                    >
                                      {type}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Collections */}
                          {category.subcategories.collections && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() =>
                                  setHoveredSubcategory(hoveredSubcategory === "collections" ? null : "collections")
                                }
                              >
                                <span>Collections</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "collections" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "collections" && (
                                <div className="pl-4 space-y-3 text-sm">
                                  {/* Styles */}
                                  {category.subcategories.collections.styles && (
                                    <div>
                                      <div className="font-medium text-gray-800 mb-1">Styles</div>
                                      <div className="pl-2 space-y-1">
                                        {category.subcategories.collections.styles.map((style) => (
                                          <Link
                                            key={style}
                                            href={`/products?category=${category.slug}&style=${style.toLowerCase().replace(/\s+/g, "-")}`}
                                            className="block text-gray-800 hover:text-teal-700"
                                          >
                                            {style}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Brands */}
                                  {category.subcategories.collections.brands && (
                                    <div>
                                      <div className="font-medium text-gray-800 mb-1">Brands</div>
                                      <div className="pl-2 space-y-1">
                                        {category.subcategories.collections.brands.map((brand) => (
                                          <Link
                                            key={brand}
                                            href={`/products?category=${category.slug}&brand=${brand.toLowerCase().replace(/\s+/g, "-")}`}
                                            className="block text-gray-800 hover:text-teal-700"
                                          >
                                            {brand}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Seasonal Collections */}
                          {category.subcategories.seasonal && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() =>
                                  setHoveredSubcategory(hoveredSubcategory === "seasonal" ? null : "seasonal")
                                }
                              >
                                <span>Seasonal Collections</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "seasonal" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "seasonal" && (
                                <div className="pl-4 space-y-1 text-sm">
                                  {category.subcategories.seasonal.map((season) => (
                                    <Link
                                      key={season}
                                      href={`/products?category=${category.slug}&season=${season.toLowerCase().replace(/\s+/g, "-")}`}
                                      className="block text-gray-800 hover:text-teal-700"
                                    >
                                      {season}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Brands (direct, not in collections) */}
                          {category.subcategories.brands && (
                            <div>
                              <div
                                className="flex justify-between items-center cursor-pointer font-medium text-gray-800 mb-2"
                                onClick={() => setHoveredSubcategory(hoveredSubcategory === "brands" ? null : "brands")}
                              >
                                <span>Brands</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${hoveredSubcategory === "brands" ? "rotate-180" : ""}`}
                                />
                              </div>
                              {hoveredSubcategory === "brands" && (
                                <div className="pl-4 space-y-1 text-sm">
                                  {category.subcategories.brands.map((brand) => (
                                    <Link
                                      key={brand}
                                      href={`/products?category=${category.slug}&brand=${brand.toLowerCase().replace(/\s+/g, "-")}`}
                                      className="block text-gray-800 hover:text-teal-700"
                                    >
                                      {brand}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Next slide button */}
              <button
                onClick={nextSlide}
                className="p-3 rounded-full border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition shrink-0"
                aria-label="Next category"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* View all products button */}
        <div className="mt-10 text-center">
          <Link href="/products">
            <Button className="px-8 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-opacity-90 transition">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
