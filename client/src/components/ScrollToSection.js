"use client"

import { useEffect } from "react"
import "./ScrollToSection.css"

const ScrollToSection = ({ targetId, children, className, smooth = true, offset = 0 }) => {
  const handleClick = (e) => {
    e.preventDefault()

    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset

      if (smooth) {
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      } else {
        window.scrollTo(0, targetPosition)
      }
    }
  }

  // Handle hash in URL on page load
  useEffect(() => {
    if (window.location.hash === `#${targetId}`) {
      setTimeout(() => {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      }, 500) // Delay to ensure page is fully loaded
    }
  }, [targetId, offset])

  return (
    <button className={`scroll-to-section ${className || ""}`} onClick={handleClick}>
      {children}
    </button>
  )
}

export default ScrollToSection
