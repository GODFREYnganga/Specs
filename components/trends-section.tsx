import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * TrendItem interface defining the structure of trend data
 */
interface TrendItem {
  id: number
  image: string
  title: string
  description: string
}

/**
 * Sample trend data for the trends section
 * Each item represents a different eyewear trend with image and description
 */
const trendItems: TrendItem[] = [
  {
    id: 1,
    image: "/images/people/man-round-glasses.png",
    title: "Elevate Your Style",
    description:
      "Sunglasses aren't just accessories; they're statements of confidence and sophistication that transform any outfit into a fashion statement.",
  },
  {
    id: 2,
    image: "/images/people/girl-glasses.png",
    title: "Protection with Personality",
    description:
      "Our sunglasses offer 100% UV protection while adding a touch of personality to your everyday look, no matter your age.",
  },
  {
    id: 3,
    image: "/images/people/smiling-man-glasses.png",
    title: "Clarity in Every Moment",
    description:
      "Experience enhanced visibility with polarized lenses that reduce glare and provide crystal-clear vision, even in the brightest conditions.",
  },
  {
    id: 4,
    image: "/images/people/family-glasses.png",
    title: "For Every Adventure",
    description:
      "From family outings to solo adventures, our sunglasses are designed to accompany you through life's brightest moments with style and comfort.",
  },
]

/**
 * TrendsSection Component
 *
 * Displays a grid of trend cards with images, titles, and descriptions.
 * Features hover effects and call-to-action buttons.
 */
export function TrendsSection() {
  return (
    <section className="trends-section bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section header with decorative lines */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
            <h2 className="text-3xl font-bold px-4">Unlock New Trends</h2>
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Row 1 - First two trend items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendItems.slice(0, 2).map((item) => (
              <div key={item.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative h-80 overflow-hidden">
                  {/* Trend image with overlay */}
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity"></div>

                  {/* Content overlay with title, description, and button */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm mb-4">{item.description}</p>
                    <div className="flex justify-center">
                      <Link href="/products?category=sunglasses">
                        <Button className="trend-badge opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Shop Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 - Second two trend items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendItems.slice(2, 4).map((item) => (
              <div key={item.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative h-80 overflow-hidden">
                  {/* Trend image with overlay */}
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity"></div>

                  {/* Content overlay with title, description, and button */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm mb-4">{item.description}</p>
                    <div className="flex justify-center">
                      <Link href="/products?category=sunglasses">
                        <Button className="trend-badge opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Shop Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
