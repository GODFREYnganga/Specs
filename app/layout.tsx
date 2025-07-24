import type React from "react"
import { ConditionalLayout } from "@/components/layout/conditional-layout"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { CartProvider } from "@/hooks/use-modern-cart"
import { WishlistProvider } from "@/hooks/use-modern-wishlist"
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
            <CartProvider>
              <WishlistProvider>
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};
