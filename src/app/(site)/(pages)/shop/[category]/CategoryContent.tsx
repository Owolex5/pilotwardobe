// app/shop/[category]/CategoryContent.tsx
"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleGridItem from "@/components/Shop/SingleGridItem";
import AIUniformRecommender from "@/components/Shop/AIUniformRecommender";

// Inline CategoryStats component
const CategoryStats = ({ products }: { products: any[] }) => {
  const officialProducts = products.filter(p => p.seller === "PilotWardrobe").length;
  const onSaleProducts = products.filter(p => p.discountedPrice && p.discountedPrice < p.price).length;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
          <div className="text-2xl font-bold text-blue-700 mb-2">{products.length}</div>
          <div className="text-sm text-blue-600">Total Products</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
          <div className="text-2xl font-bold text-green-700 mb-2">{officialProducts}</div>
          <div className="text-sm text-green-600">Official Store Items</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5">
          <div className="text-2xl font-bold text-red-700 mb-2">{onSaleProducts}</div>
          <div className="text-sm text-red-600">On Sale</div>
        </div>
      </div>
    </div>
  );
};

// FilterSidebar component
const FilterSidebar = ({ category, products }: { category: string; products: any[] }) => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);

  // Extract unique conditions and sellers
  const conditions = ["New", "Pre-owned - Excellent", "Pre-owned - Good", "New - Sealed"];
  const sellers = Array.from(new Set(products.map(p => p.seller))).filter(Boolean);

  const handleConditionToggle = (condition: string) => {
    setSelectedCondition(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleSellerToggle = (seller: string) => {
    setSelectedSellers(prev =>
      prev.includes(seller)
        ? prev.filter(s => s !== seller)
        : [...prev, seller]
    );
  };

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">${priceRange[0]}</span>
            <span className="text-gray-600">${priceRange[1]}+</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="5000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Min"
            />
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Condition */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Condition</h3>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label key={condition} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCondition.includes(condition)}
                onChange={() => handleConditionToggle(condition)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Seller */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Seller</h3>
        <div className="space-y-2">
          {sellers.map((seller) => (
            <label key={seller} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedSellers.includes(seller)}
                onChange={() => handleSellerToggle(seller)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {seller === "PilotWardrobe" ? (
                  <span className="font-medium text-blue-600">{seller} (Official)</span>
                ) : (
                  seller
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          setPriceRange([0, 5000]);
          setSelectedCondition([]);
          setSelectedSellers([]);
        }}
        className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );
};

interface CategoryContentProps {
  category: string;
  displayCategory: string;
  filteredProducts: any[];
}

const CategoryContent = ({ category, displayCategory, filteredProducts }: CategoryContentProps) => {
  // Get category icon
  const getCategoryIcon = () => {
    switch(category) {
      case "uniforms":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "headsets":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        );
      case "flight-bags":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case "watches":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "sunglasses":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case "aircraft-parts":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "manuals-documents":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case "models-collectibles":
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
    }
  };

  // Get category description
  const getCategoryDescription = () => {
    switch(category) {
      case "uniforms":
        return "Professional pilot uniforms, epaulettes, shirts, pants, and accessories for aviation professionals.";
      case "headsets":
        return "High-quality aviation headsets from top brands like Bose, Lightspeed, and David Clark.";
      case "flight-bags":
        return "Durable flight bags, kneeboards, and luggage designed for pilots and aviation crew.";
      case "watches":
        return "Precision aviation watches and timepieces from trusted brands for pilots.";
      case "sunglasses":
        return "Professional aviation sunglasses and eyewear for optimal visibility and protection.";
      case "aircraft-parts":
        return "Genuine aircraft parts, instruments, and components for maintenance and restoration.";
      case "manuals-documents":
        return "Aviation manuals, logbooks, charts, and essential documents for pilots.";
      case "models-collectibles":
        return "Aircraft models, collectibles, and memorabilia for aviation enthusiasts.";
      case "accessories":
        return "Essential aviation accessories and gear for pilots and flight crew.";
      default:
        return "Premium aviation gear and equipment for professionals and enthusiasts.";
    }
  };

  // Get specific category features
  const getCategoryFeatures = () => {
    const baseFeatures = [
      { text: "Quality Inspected" },
      { text: "30-Day Returns" },
      { text: "Fast Shipping" }
    ];

    switch(category) {
      case "aircraft-parts":
        return [
          ...baseFeatures,
          { text: "Genuine Parts" },
          { text: "Certified Components" }
        ];
      case "uniforms":
        return [
          ...baseFeatures,
          { text: "Professional Grade" },
          { text: "Size Guarantee" }
        ];
      case "headsets":
        return [
          ...baseFeatures,
          { text: "Noise Cancelling" },
          { text: "ANR Technology" }
        ];
      default:
        return baseFeatures;
    }
  };

  return (
    <>
      <Breadcrumb
        title={displayCategory}
        pages={["Home", "Shop", displayCategory]}
      />

      <section className="py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Header */}
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600">
                  {getCategoryIcon()}
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    <span>Shop Category</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                    {displayCategory}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {getCategoryDescription()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
                </div>
                <button className="lg:hidden px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* AI Recommender for Uniforms */}
          {category === "uniforms" && (
            <div className="mb-12">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">AI Uniform Finder</h3>
                </div>
                <p className="text-gray-600 mb-6">Get personalized uniform recommendations based on your airline, size, and preferences.</p>
                <AIUniformRecommender />
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="lg:col-span-1">
              <FilterSidebar 
                category={category}
                products={filteredProducts}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Category Stats */}
              <CategoryStats products={filteredProducts} />

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((item) => (
                      <SingleGridItem key={item.id} item={item} />
                    ))}
                  </div>

                  {/* Pagination/Results Info */}
                  <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-gray-900">1-{filteredProducts.length}</span> of{" "}
                      <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
                        1
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Next
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Empty State - This shows when there are NO products in this category
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found in this category</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We don't have any {displayCategory.toLowerCase()} listed yet. Check back soon for new arrivals, or browse our other categories!
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a
                      href="/shop/uniforms"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                    >
                      Browse Uniforms
                    </a>
                    <a
                      href="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                    >
                      View All Categories
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Description */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">About Our {displayCategory}</h3>
              <p className="text-gray-600 leading-relaxed">
                PilotWardrobe offers premium {displayCategory.toLowerCase()} sourced from aviation professionals worldwide. 
                Each product undergoes rigorous quality inspection and comes with our satisfaction guarantee. 
                Whether you're looking for professional gear, replacement parts, or selling your gently used equipment, 
                you're in the right place.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {getCategoryFeatures().map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryContent;