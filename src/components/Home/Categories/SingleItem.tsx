import React from "react";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }: { item: any }) => {
  return (
    <Link href={item.link} className="block group h-full">
      <div className="relative flex flex-col items-center bg-white rounded-2xl p-8 transition-all duration-500 border border-transparent hover:border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] h-full">
        
        {/* Modern "Hot" Tag - Subtle & Sleek */}
        {item.hot && (
          <div className="absolute top-4 right-4 z-10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
        )}

        {/* Minimalist Image Container */}
        <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
          {/* Subtle Background Glow on Hover */}
          <div className="absolute inset-0 bg-blue-500/0 rounded-full scale-50 group-hover:scale-125 group-hover:bg-blue-50/50 transition-all duration-700 ease-out" />
          
          <div className="relative w-full h-full transform transition-transform duration-500 group-hover:-translate-y-2">
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-contain"
              sizes="96px"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center w-full">
          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-300">
            {item.title}
          </h3>
          
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
            {item.items} Essentials
          </p>

          {/* Discount/Promo - Only show if exists, styled cleanly */}
          {item.discount && (
            <div className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
              Save {item.discount}%
            </div>
          )}
        </div>

        {/* The "Explore" line - cleaner than a floating arrow */}
        <div className="mt-auto pt-6 overflow-hidden">
            <div className="flex items-center justify-center gap-1 text-blue-600 text-xs font-bold transition-all duration-300 translate-y-8 group-hover:translate-y-0">
                <span>VIEW COLLECTION</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default SingleItem;