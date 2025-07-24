"use client"
import React from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ScrollToSection } from "@/components/scroll-to-section"
import { FloatingConversionBar } from "@/components/floating-conversion-bar"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  return (
    <>
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <ScrollToSection />}
      {!isAdminRoute && <FloatingConversionBar />}
      <div className={isAdminRoute ? "" : "pt-[160px]"}>{children}</div>
      {!isAdminRoute && <Footer />}
    </>
  )
}
