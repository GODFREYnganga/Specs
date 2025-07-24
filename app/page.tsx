import { HeroSection } from "@/components/hero-section"
import { ModernCategorySection } from "@/components/modern-category-section"
import { FeaturesSection } from "@/components/features-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { PerfectFitSection } from "@/components/perfect-fit-section"
import { EyeTestSection } from "@/components/eye-test-section"
import { ConversionFooterSection } from "@/components/conversion-footer-section"
import { Newsletter } from "@/components/newsletter"
import { FeaturedProducts } from "@/components/featured-products"
import TrendSlider from "@/components/specs-shape";
import {EyewearComponent} from "@/components/specs-brands"
import BestSellingFrame from '@/components/bestselling-frame'
import EyeTestPromo from "@/components/eye-testpromo"
import TrendingSunglasses from "@/components/trending-sunglasses"
import ImageTileSection from "@/components/product-navbar";



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* 1. ImageTileSection - Clear value proposition */}
        <ImageTileSection />
        {/* 1. Hero Section - Clear value proposition */}
        <HeroSection />
        

        {/* 1. Hero Section - Clear value proposition */}
        <TrendSlider />

         {/* Bestsellingframe */}
        <BestSellingFrame />




        {/* 7. Eye Test CTA - Professional service */}
        <EyeTestSection />

        {/* 7. Eye Test CTA - Professional service */}
        <EyeTestPromo />

        {/* 2. Category Navigation - Simple and focused */}
        <ModernCategorySection />

        {/* 6. Perfect Fit - Address main concern */}
        <PerfectFitSection />

        {/* 4. Features - Why choose us */}
        <FeaturesSection />

         {/* 8. Final Conversion Push - Expert help */}
        <ConversionFooterSection />

        {/* trendingsunglasses */}

        <TrendingSunglasses/>
     

        {/* 6. Perfect Fit - Address main concern */}
        <EyewearComponent />

        {/* 5. Social Proof - Reviews and testimonials */}
        <SocialProofSection />      
        
        {/* 9. Newsletter - Lead capture */}
        <Newsletter />
      </main>
    </div>
  )
}
