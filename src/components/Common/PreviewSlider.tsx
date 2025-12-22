// src/components/Shop/PreviewSliderModal.tsx (or your exact path)

"use client";

import React, { useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";

const PreviewSliderModal = () => {
  const { closePreviewModal, isModalPreviewOpen } = usePreviewSlider();
  const sliderRef = useRef<any>(null); // Swiper instance ref

  // Get product from Redux (set by Quick View or Detail page)
  const product = useAppSelector((state) => state.productDetailsReducer.value);

  // Use actual product previews, fallback to first if none
  const previews = product?.imgs?.previews || [];

  const handlePrev = useCallback(() => {
    sliderRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    sliderRef.current?.swiper.slideNext();
  }, []);

  if (!product || previews.length === 0) {
    return null; // Safety: don't render if no images
  }

  return (
    <div
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 px-4 transition-opacity ${
        isModalPreviewOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Close Button */}
      <button
        onClick={closePreviewModal}
        aria-label="Close preview"
        className="absolute top-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition"
      >
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition group"
        aria-label="Previous image"
      >
        <svg className="h-10 w-10 -ml-1 group-hover:-ml-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition group"
        aria-label="Next image"
      >
        <svg className="h-10 w-10 ml-1 group-hover:ml-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Swiper Carousel */}
      <div className="w-full max-w-4xl">
        <Swiper
          ref={sliderRef}
          modules={[Navigation]}
          spaceBetween={50}
          slidesPerView={1}
          loop={previews.length > 1}
          className="preview-slider"
        >
          {previews.map((img: string, index: number) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center">
                <div className="relative aspect-square w-full max-w-2xl">
                  <Image
                    src={img}
                    alt={`${product.title} - View ${index + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Optional: Image counter */}
        {previews.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
            {sliderRef.current?.swiper ? (
              <>
                {sliderRef.current.swiper.realIndex + 1} / {previews.length}
              </>
            ) : (
              <>1 / {previews.length}</>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewSliderModal;