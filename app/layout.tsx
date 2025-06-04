import type React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollToSection } from "@/components/scroll-to-section"

import "@/app/globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Lens2Cart - Premium Eyewear</title>
        <meta
          name="description"
          content="Premium eyewear for those who appreciate quality, style, and perfect vision."
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header />
          <ScrollToSection />
          <div className="pt-[160px]">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
