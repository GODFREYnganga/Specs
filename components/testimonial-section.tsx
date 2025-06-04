import { Star } from "lucide-react"

/**
 * Testimonial interface defining the structure of testimonial data
 */
interface Testimonial {
  id: number
  name: string
  review: string
  rating: number
  image: string
  product: string
}

/**
 * Sample testimonial data for the testimonials section
 * Each item represents a customer review with rating and product information
 */
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Dawson",
    review:
      "These frames are perfect for my face shape. The quality is excellent, and they're so lightweight I almost forget I'm wearing them.",
    rating: 5,
    image: "/images/testimonials/man-round-glasses.png",
    product: "Oslo Round Frames",
  },
  {
    id: 2,
    name: "Sophie Chen",
    review:
      "I get compliments on these sunglasses everywhere I go. The polarized lenses are amazing for driving, and they fit comfortably all day.",
    rating: 5,
    image: "/images/testimonials/woman-gold-glasses.png",
    product: "Madrid Aviators",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    review:
      "The blue light filtering on these glasses has made a huge difference in my eye strain after long workdays. Plus, they look professional for video calls.",
    rating: 4,
    image: "/images/testimonials/man-black-glasses.png",
    product: "Aspen Frames",
  },
]

/**
 * TestimonialSection Component
 *
 * Displays customer testimonials in a grid layout.
 * Features star ratings, customer photos, and product information.
 */
export function TestimonialSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">What Our Customers Say</h2>
        <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
          Hear from our satisfied customers about their experience with our eyewear
        </p>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-sm transition-all hover:shadow-md border-l-4 border-teal-600"
            >
              {/* Star rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.rating ? "text-teal-700 fill-teal-700" : "text-gray-300"}
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-gray-600 mb-6">"{testimonial.review}"</p>

              {/* Customer info with photo */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
