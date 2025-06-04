import { Link } from "react-router-dom"
import "./TrendsSection.css"

const TrendsSection = () => {
  const trends = [
    {
      id: 1,
      title: "Oversized Frames",
      description: "Bold, statement-making frames that add drama to any look.",
      image: "/images/hero/blue-frame.png",
      link: "/products?category=oversized",
    },
    {
      id: 2,
      title: "Transparent Frames",
      description: "Subtle, modern frames that complement any face shape.",
      image: "/images/products/clear-frames.png",
      link: "/products?category=transparent",
    },
    {
      id: 3,
      title: "Colorful Frames",
      description: "Express your personality with vibrant, eye-catching colors.",
      image: "/images/hero/colorful-frames.png",
      link: "/products?category=colorful",
    },
  ]

  return (
    <section id="trends" className="trends-section">
      <div className="trends-container">
        <h2 className="section-title">Latest Eyewear Trends</h2>
        <p className="section-subtitle">
          Stay ahead of the curve with our curated selection of this season's most popular styles.
        </p>

        <div className="trends-grid">
          {trends.map((trend) => (
            <div key={trend.id} className="trend-card">
              <div className="trend-image-container">
                <img src={trend.image || "/placeholder.svg"} alt={trend.title} className="trend-image" />
              </div>
              <div className="trend-content">
                <h3 className="trend-title">{trend.title}</h3>
                <p className="trend-description">{trend.description}</p>
                <Link to={trend.link} className="trend-link">
                  Explore Collection
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="trends-cta">
          <h3>Find Your Perfect Style</h3>
          <p>
            Our style quiz helps you discover frames that match your face shape, personal style, and lifestyle needs.
          </p>
          <Link to="/style-quiz" className="cta-button">
            Take the Style Quiz
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TrendsSection
