import React from "react";
import SingleItem from "./SingleItem";
import Link from "next/link";
import shopData from "@/components/Shop/shopData";

const BestSeller = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-100 pb-8 gap-6">
          <div className="max-w-md">
            <p className="text-blue font-bold text-xs uppercase tracking-[0.2em] mb-3">
              Most Popular 
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-dark tracking-tight">
              Aviation <span className="text-blue underline decoration-blue/20 underline-offset-8">Best Sellers</span>
            </h2>
          </div>
          
          <Link
            href="/marketplace"
            className="group text-dark font-bold text-sm flex items-center gap-2 hover:text-blue transition-colors"
          >
            VIEW All Products
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid Layout - 3 columns for Best Sellers feels more "exclusive" than 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {shopData.slice(1, 7).map((item, key) => (
            <SingleItem item={item} key={key} />
          ))}
        </div>

        {/* Bottom CTA for Mobile */}
        <div className="mt-16 flex justify-center lg:hidden">
          <Link
            href="/marketplace"
            className="w-full text-center py-4 bg-dark text-white rounded-xl font-bold"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;