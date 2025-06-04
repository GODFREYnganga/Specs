import HeroSection from "../components/HeroSection"
import FeaturedProducts from "../components/FeaturedProducts"
import CategorySection from "../components/CategorySection"
import TrendsSection from "../components/TrendsSection"
import PerfectFitSection from "../components/PerfectFitSection"
import ImageCarousel from "../components/ImageCarousel"
import EyeTestSection from "../components/EyeTestSection"
import TestimonialSection from "../components/TestimonialSection"
import Newsletter from "../components/Newsletter"
import ContactSection from "../components/ContactSection"
import "./Home.css"

function Home() {
  return (
    <div className="home-page">
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
    </div>
  )
}

export default Home
