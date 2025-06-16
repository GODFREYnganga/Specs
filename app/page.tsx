import { HeroSection } from "@/components/hero-section"
import { ModernCategorySection } from "@/components/modern-category-section"
import { SimpleBestsellers } from "@/components/simple-bestsellers"
import { FeaturesSection } from "@/components/features-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { PerfectFitSection } from "@/components/perfect-fit-section"
import { EyeTestSection } from "@/components/eye-test-section"
import { ConversionFooterSection } from "@/components/conversion-footer-section"
import { Newsletter } from "@/components/newsletter"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* 1. Hero Section - Clear value proposition */}
        <HeroSection />
        
        {/* 2. Category Navigation - Simple and focused */}
        <ModernCategorySection />
        
        {/* 3. Bestsellers - Social proof through popularity */}
        <SimpleBestsellers />
        
        {/* 4. Features - Why choose us */}
        <FeaturesSection />
        
        {/* 5. Social Proof - Reviews and testimonials */}
        <SocialProofSection />
        
        {/* 6. Perfect Fit - Address main concern */}
        <PerfectFitSection />
        
        {/* 7. Eye Test CTA - Professional service */}
        <EyeTestSection />
        
        {/* 8. Final Conversion Push - Expert help */}
        <ConversionFooterSection />
        
        {/* 9. Newsletter - Lead capture */}
        <Newsletter />
      </main>
    </div>
  )
}
