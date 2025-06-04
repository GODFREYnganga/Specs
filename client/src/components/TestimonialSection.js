"use client"

import { useState, useEffect } from "react"
import "./TestimonialSection.css"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Designer",
    image: "/images/testimonials/woman-gold-glasses.png",
    quote:
      "I've been wearing glasses for over 20 years, and these are by far the most comfortable frames I've ever owned. The online try-on feature was surprisingly accurate!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    image: "/images/testimonials/man-round-glasses.png",
    quote:
      "As someone who spends 10+ hours a day in front of screens, the blue light filtering on these glasses has made a huge difference in reducing my eye strain and improving my sleep.",
  },
  {
    id: 3,
    name: "David Wilson",
    role: "Marketing Director",
    image: "/images/testimonials/man-black-glasses.png",
    quote:
      "The customer service is exceptional. When my frames needed adjustment, they guided me through the process over video call. I've already recommended them to all my colleagues!",
  },
]

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleDotClick = (index) => {
    setActiveIndex(index)
  }

  return (
    <section id="testimonials" className="testimonial-section">
      <div className="testimonial-container">
        <h2 className="section-title">What Our Customers Say</h2>

        <div className="testimonials-wrapper">
          <div className="testimonials-slider" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="quote-icon">"</div>
                  <p className="testimonial-quote">{testimonial.quote}</p>
                  <div className="testimonial-author">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="author-image"
                    />
                    <div className="author-info">
                      <h3 className="author-name">{testimonial.name}</h3>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonial-dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection
