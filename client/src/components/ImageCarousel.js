"use client"

import { useState, useEffect } from "react"
import "./ImageCarousel.css"

const ImageCarousel = ({ images, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    let timer
    if (autoPlay) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, interval)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [autoPlay, images.length, interval])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className="carousel-container">
      <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="carousel-item">
            <img src={image.src || "/placeholder.svg"} alt={image.alt || `Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      <button className="carousel-control carousel-control-prev" onClick={goToPrevious}>
        <span className="carousel-control-icon">&#10094;</span>
      </button>

      <button className="carousel-control carousel-control-next" onClick={goToNext}>
        <span className="carousel-control-icon">&#10095;</span>
      </button>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
