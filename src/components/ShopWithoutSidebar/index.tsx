"use client";
import React, { useState, useMemo } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import shopData from "../Shop/shopData";
import Link from "next/link";

const ShopWithoutSidebar = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const sortOptions = [
    { value: "latest", label: "Latest Listings" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  // Logic: Search and Filter
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...shopData].filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);

    return result;
  }, [sortBy, searchQuery]);

  return (
    <>
      <Breadcrumb title="Marketplace" pages={["Home", "Shop"]} />

      {/* --- HERO SECTION --- */}
      <section className="relative py-16 bg-[#090E34] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="max-w-[1170px] mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-[600px]">
              <span className="inline-block px-4 py-2 rounded-full bg-blue/10 text-blue-400 text-sm font-bold mb-4 uppercase tracking-widest">
                The PilotWardrobe's Marketplace
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Buy, Sell & Trade <br />
                <span className="text-blue-500">Premium Flight Gear</span>
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                The trusted marketplace for aviators. Find everything from headsets to 
                uniforms, or turn your gently used gear into cash.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/sell-gear" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-900/20">
                  List Your Gear
                </Link>
                <Link href="#listings" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition backdrop-blur-md">
                  Browse Gallery
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-white text-2xl font-bold">10+</h3>
                <p className="text-gray-400 text-sm">Active Pilots</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm mt-8">
                <h3 className="text-white text-2xl font-bold">45+</h3>
                <p className="text-gray-400 text-sm">Items Sold</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="listings" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          
          {/* --- TOP ACTION BAR --- */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search gear (e.g. Bose, Garmin, Uniforms)..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {/* View Switcher */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg transition ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- PRODUCT LISTINGS --- */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-6"}>
              {filteredAndSortedProducts.map((item, index) =>
                viewMode === "grid" ? (
                  <SingleGridItem item={item} key={item.id || index} />
                ) : (
                  <SingleListItem item={item} key={item.id || index} />
                )
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No gear found matching "{searchQuery}"</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              <button onClick={() => setSearchQuery("")} className="mt-4 text-blue-600 font-bold underline">Clear All</button>
            </div>
          )}

          {/* --- TRUST FOOTER --- */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-12">
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Verified Sellers</h4>
                <p className="text-sm text-gray-500">All pilot gear is inspected for quality and authenticity.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-3 rounded-xl text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Secure Payments</h4>
                <p className="text-sm text-gray-500">Your transactions are protected with military-grade encryption.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Pilot Satisfaction</h4>
                <p className="text-sm text-gray-500">30-day return policy for any gear that doesn't meet your flight standards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
       {/* --- AVIATION IMAGES PROMO BANNER --- */}
     <section className="py-12 bg-white">
  <div className="max-w-[1170px] mx-auto px-4">
    {/* flex-col-reverse makes the image (bottom in code) appear at the top on mobile */}
    <div className="relative rounded-[2.5rem] bg-gradient-to-r from-blue-700 to-indigo-900 overflow-hidden shadow-2xl flex flex-col-reverse lg:flex-row items-stretch">
      
      {/* LEFT SIDE: Content */}
      <div className="relative z-10 w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <span className="inline-block text-blue-300 font-bold uppercase tracking-widest text-sm mb-3">
          New Opportunity
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-blue mb-4 leading-tight">
          To Earn on Pilotwardrobe
        </h2>
        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
          Turn your cockpit views and wing-tip sunsets into revenue. Join our premium gallery where pilots sell high-res images to enthusiasts.
        </p>
        <div>
          <Link href="/aviation-images" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-lg">
            Explore Image Gallery 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: Image (Appears on TOP on mobile) */}
      <div className="relative w-full lg:w-1/2 h-64 md:h-80 lg:h-auto overflow-hidden">
        <img
          src="/images/pward/ATR-110237_MD.jpg"
          alt="Aviation Photography"
          className="object-cover h-full w-full"
        />
        {/* Gradients to blend the image into the background */}
        {/* Bottom fade for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-transparent to-transparent lg:hidden" />
        {/* Left fade for desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/80 via-transparent to-transparent hidden lg:block" />
      </div>
      
    </div>
  </div>
</section>
    </>
  );
};

export default ShopWithoutSidebar;