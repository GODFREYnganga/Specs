"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function ScrollToSection() {
  const router = useRouter()

  useEffect(() => {
    // Check if there's a hash in the URL
    if (typeof window !== "undefined") {
      const hash = window.location.hash
      if (hash) {
        // Remove the # symbol
        const id = hash.replace("#", "")
        const element = document.getElementById(id)

        if (element) {
          // Wait a bit for the page to fully render
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" })
          }, 100)
        }
      }
    }

    // Handle clicks on hash links
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (link && link.hash && link.pathname === window.location.pathname) {
        e.preventDefault()
        const id = link.hash.replace("#", "")
        const element = document.getElementById(id)

        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          // Update URL without page reload
          window.history.pushState(null, "", link.hash)
        }
      }
    }

    document.addEventListener("click", handleHashClick)
    return () => document.removeEventListener("click", handleHashClick)
  }, [router])

  return null
}
