import React from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import shopData from "@/components/Shop/shopData";

const LatestListings = () => {
  return (
    <section className="overflow-hidden py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-3 font-semibold text-blue uppercase tracking-wider mb-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="#3C50E0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="#3C50E0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="#3C50E0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Fresh Listings
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-dark mb-3">
              Latest Pilot Gear
            </h2>
            <p className="text-dark-4 text-lg">
              New and pre-owned aviation essentials added by pilots worldwide
            </p>
          </div>

          <Link
            href="/shop-without-sidebar"
            className="px-8 py-4 bg-blue text-white font-semibold text-lg rounded-lg hover:bg-blue-dark transition shadow-lg"
          >
            View All Listings →
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-10">
          {shopData.map((item, key) => (
            <ProductItem item={item} key={item.id || key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestListings;