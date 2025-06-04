import { FeaturedProducts } from "@/components/featured-products"
import { HeroSection } from "@/components/hero-section"
import { CategorySection } from "@/components/category-section"
import { TrendsSection } from "@/components/trends-section"
import { PerfectFitSection } from "@/components/perfect-fit-section"
import { ImageCarousel } from "@/components/image-carousel"
import { EyeTestSection } from "@/components/eye-test-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { Newsletter } from "@/components/newsletter"
import { ContactSection } from "@/components/contact-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <CategorySection />
        <TrendsSection />
        <PerfectFitSection />
        <ImageCarousel />
        <EyeTestSection />
        <TestimonialSection />
        <Newsletter />
        <ContactSection />
      </main>
    </div>
  )
}
