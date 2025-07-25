"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const items = [
  { name: "Aviator", image: "/images/shapes/aviator.png", link: "/products/aviator" },
  { name: "Rectangle", image: "/images/shapes/rectangle.jpeg", link: "/products/rectangle" },
  { name: "Square", image: "/images/shapes/square.jpeg", link: "/products/square" },
  { name: "Round", image: "/images/shapes/round.png", link: "/products/round" },
  { name: "Geometric", image: "/images/shapes/geometric.jpeg", link: "/products/geometric" },
  { name: "Cat-eye", image: "/images/shapes/cateeye.png", link: "/products/cateeye" },
  { name: "Wayfarer", image: "/images/shapes/wayfarer.jpeg", link: "/products/wayfarer" },
  { name: "Oval", image: "/images/shapes/oval.jpeg", link: "/products/oval" },
];

export default function TrendSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const visibleCount = 4;
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);

  const scroll = (direction) => {
    if (direction === "left") {
      setStartIndex((prev) => Math.max(prev - visibleCount, 0));
    } else {
      setStartIndex((prev) =>
        Math.min(prev + visibleCount, items.length - visibleCount)
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (direction === "right") {
        if (startIndex + visibleCount >= items.length) {
          setDirection("left");
          setStartIndex((prev) => Math.max(prev - visibleCount, 0));
        } else {
          setStartIndex((prev) => prev + visibleCount);
        }
      } else {
        if (startIndex <= 0) {
          setDirection("right");
          setStartIndex((prev) => Math.min(prev + visibleCount, items.length - visibleCount));
        } else {
          setStartIndex((prev) => prev - visibleCount);
        }
      }
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, [startIndex, direction]);

  return (
    <div
      style={{
        minHeight: "300px",
        backgroundColor: "#ffffffff",
        padding: "0 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          display: "flex",
          gap: "40px",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left Text Section */}
        <div style={{ minWidth: "200px" }}>
          <h2 style={{ fontSize: "50px", fontWeight: 400, margin: 0 }}>WEAR THE</h2>
          <h2 style={{ fontSize: "40px", fontWeight: 800, margin: 0 }}>TREND</h2>
          <p style={{ color: "#000000ff", marginTop: "8px" }}>Ourhottestcollections</p>
        </div>

        {/* Images + Arrows Section */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative" }}>
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            style={{
              background: "white",
              border: "none",
              borderRadius: "50%",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              padding: "10px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <ChevronLeft />
          </button>

          {/* Images */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              flex: 1,
              justifyContent: "space-between",
            }}
          >

            {visibleItems.map((item, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "16px",
                  flex: 1,
                }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={180}
                  height={140}
                  style={{
                    objectFit: "contain",
                    marginBottom: "10px",
                    borderRadius: "4px",
                  }}
                />
                <p style={{ fontWeight: "500", textAlign: "center" }}>{item.name}</p>
                <div style={{ marginTop: "12px" }}>
                  <a
                    href={item.link}
                    style={{
                      backgroundColor: "#0891b2",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "none", // ensures it looks like a button
                      display: "inline-block",
                      marginTop: "12px"
                    }}
                  >
                    Explore
                  </a>
                </div>
              </div>

            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            style={{
              background: "white",
              border: "none",
              borderRadius: "50%",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              padding: "10px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
