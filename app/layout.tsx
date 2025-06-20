import type React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollToSection } from "@/components/scroll-to-section"
import { FloatingConversionBar } from "@/components/floating-conversion-bar"
import { AuthProvider } from "@/hooks/use-auth"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { Toaster } from "@/components/ui/toaster"

import "@/app/globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Lens2Cart - Premium Eyewear</title>
        <meta
          name="description"
          content="Premium eyewear for those who appreciate quality, style, and perfect vision."
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <WishlistProvider>
              <Header />
              <ScrollToSection />
              <FloatingConversionBar />
              <div className="pt-[160px]">{children}</div>
              <Footer />
              <Toaster />
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};
