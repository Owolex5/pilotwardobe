"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Add Navigation for prev/next
import { useCallback, useRef } from "react";
import data from "./categoryData";
import Image from "next/image";
import SingleItem from "./SingleItem";

import "swiper/css";
import "swiper/css/navigation";

const Categories = () => {
  const sliderRef = useRef<any>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
       <div className="flex flex-col items-center text-center mb-14">
  {/* Modern Badge-style Label */}
  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue/5 border border-blue/10 mb-4 transition-all hover:bg-blue/10">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue"></span>
    </span>
    <span className="text-blue font-bold text-xs uppercase tracking-[0.25em]">
      Our Flight Deck Collections
    </span>
  </div>

  {/* Main Title with high-end typography */}
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight leading-tight">
    Shop  <span className="text-blue">Pilot</span> Essentials
  </h2>

  {/* Added a subtle subtitle for better UX/SEO */}
  <p className="mt-4 text-gray-500 max-w-lg text-sm md:text-base leading-relaxed">
    Gear up with professional-grade uniforms, headsets, and technical tools curated for every stage of your aviation journey.
  </p>
  
  {/* Subtle decorative line */}
  <div className="mt-6 w-12 h-1 bg-blue rounded-full opacity-20"></div>
</div>

        <div className="relative">
          <Swiper
            ref={sliderRef}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            loop={true}
          >
            {data.map((item) => (
              <SwiperSlide key={item.id}>
                <SingleItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue hover:text-white transition"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue hover:text-white transition"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;