"use client";

import Image from "next/image";

export default function EyeTestPromo() {
  return (
    <>{/* Header with lines */}
      <div className="text-center pt-16 pb-8">
        <div className="flex items-center justify-center mb-4">

          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="text-4xl font-bold text-black px-4">Free Online Eye Test</h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
      </div>
    <section className="w-full bg-white px-4">
      

      {/* Full-width 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Left Column Image */}
        <div className="w-full h-[300px] md:h-[400px]">
          <Image
            src="/images/banner/Eye-test.jpg"
            alt="Eye Test Left"
            className="w-full h-full object-cover rounded-lg"
            width={800}
            height={600}
          />
        </div>

        {/* Center Text + Button */}
        <div className="flex flex-col items-center justify-center px-4 text-center space-y-6 bg-blue-950 h-[300px] md:h-[400px]">
          <h3 className="text-2xl font-semibold text-white">Take an instant eye check</h3>
          <p className="text-xl font-semibold text-white">Explore Vision Insights Now !</p>
          <button className="px-10 py-3 bg-[#FF6600] text-xl font-semibold text-white rounded-full hover:bg-blue-700 transition duration-300">
            Try Now
          </button>
        </div>

        {/* Right Column Image */}
        <div className="w-full h-[300px] md:h-[400px]">
          <Image
            src="/images/banner/onlinetest.jpg"
            alt="Eye Test Right"
            className="w-full h-full object-cover rounded-lg"
            width={800}
            height={600}
          />
        </div>
      </div>
    </section>
    </>
  );
}
