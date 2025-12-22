"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductItem from "@/components/Common/ProductItem";
import shopData from "@/components/Shop/shopData";

const RecentlyViewedItems = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-dark">
              Recently Viewed Items
            </h2>
            <p className="text-dark-4 mt-2">
              Pilot gear you’ve recently checked out
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-4">
            <button
              ref={prevRef}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue hover:text-white transition group"
              aria-label="Previous"
            >
              <svg className="w-6 h-6 text-dark group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              ref={nextRef}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-blue hover:text-white transition group"
              aria-label="Next"
            >
              <svg className="w-6 h-6 text-dark group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          className="recently-viewed-carousel"
        >
          {shopData.slice(0, 8).map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <ProductItem item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RecentlyViewedItems;