"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import shopData from "../Shop/shopData";

const ShopWithoutSidebar = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("latest");

  const sortOptions = [
    { value: "latest", label: "Latest Listings" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "best-rated", label: "Best Rated" },
  ];

  return (
    <>
      <Breadcrumb title="Shop All Pilot Gear" pages={["Home", "Shop"]} />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          {/* Top Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Sort Dropdown */}
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-dark mb-2">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition bg-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-dark-4">
                  Showing <span className="font-semibold text-dark">{shopData.length}</span> pilot essentials
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-dark">View:</span>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-lg transition ${
                      viewMode === "grid" ? "bg-white shadow-md text-blue" : "text-dark-4 hover:text-dark"
                    }`}
                    aria-label="Grid view"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-lg transition ${
                      viewMode === "list" ? "bg-white shadow-md text-blue" : "text-dark-4 hover:text-dark"
                    }`}
                    aria-label="List view"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "space-y-8"
            }
          >
            {shopData.map((item, index) =>
              viewMode === "grid" ? (
                <SingleGridItem item={item} key={item.id || index} />
              ) : (
                <SingleListItem item={item} key={item.id || index} />
              )
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-16">
            <nav className="inline-flex bg-white rounded-xl shadow-lg overflow-hidden">
              <button className="px-5 py-4 text-dark-4 hover:bg-gray-100 transition" disabled>
                ← Previous
              </button>

              <button className="px-5 py-4 bg-blue text-white font-medium">1</button>
              <button className="px-5 py-4 hover:bg-gray-100 transition">2</button>
              <button className="px-5 py-4 hover:bg-gray-100 transition">3</button>
              <span className="px-5 py-4 text-dark-4">...</span>
              <button className="px-5 py-4 hover:bg-gray-100 transition">8</button>

              <button className="px-5 py-4 text-dark hover:bg-gray-100 transition">
                Next →
              </button>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;