import { Link } from "react-router-dom"
import "./PerfectFitSection.css"

function PerfectFitSection() {
  return (
    <section className="perfect-fit-section py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section header with decorative lines */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
            <h2 className="text-3xl font-bold text-gray-800 px-4">Find The Perfect Fit</h2>
            <div className="h-px bg-teal-600 w-16 md:w-32"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover eyewear that complements your unique style and vision needs with our personalized fitting services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Face Shape Guide */}
          <div className="fit-card bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-64">
              <img
                src="/images/people/woman-glasses.png"
                alt="Face shape guide"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Face Shape Guide</h3>
              <p className="text-gray-600 mb-4">
                Find frames that perfectly complement your face shape. Our guide helps you identify your face shape and
                recommends the most flattering styles.
              </p>
              <Link to="/face-shape-guide" className="text-teal-600 font-medium hover:text-teal-700 flex items-center">
                Find Your Match
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Virtual Try-On */}
          <div className="fit-card bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-64">
              <img src="/images/people/man-glasses.png" alt="Virtual try-on" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Virtual Try-On</h3>
              <p className="text-gray-600 mb-4">
                Try before you buy with our virtual try-on technology. See how different frames look on your face
                without leaving home.
              </p>
              <Link to="/virtual-try-on" className="text-teal-600 font-medium hover:text-teal-700 flex items-center">
                Try Frames Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Frame Size Guide */}
          <div className="fit-card bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-64">
              <img src="/images/people/kid-glasses.png" alt="Frame size guide" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Frame Size Guide</h3>
              <p className="text-gray-600 mb-4">
                Understanding frame measurements ensures a comfortable fit. Learn how to read frame sizes and find your
                perfect measurements.
              </p>
              <Link to="/frame-size-guide" className="text-teal-600 font-medium hover:text-teal-700 flex items-center">
                Size Guide
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PerfectFitSection
