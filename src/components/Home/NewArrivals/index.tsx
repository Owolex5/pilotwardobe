import React from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import shopData from "@/components/Shop/shopData";

const LatestListings = () => {
  // Filter products owned by PilotWardrobe only
  const pilotWardrobeProducts = shopData.filter(item => 
    item.seller === "PilotWardrobe" || 
    item.store === "PilotWardrobe" || 
    item.isOfficial === true
  ).slice(0, 8); // Show only first 8 items

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-sm"></div>
              <svg className="relative w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">
              Official Store
            </span>
          </div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Premium <span className="text-blue-600">Official</span> Gear
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                Curated collection of brand-new, quality-assured pilot equipment 
                <span className="block text-sm text-gray-500 mt-2">
                  ✓ Direct from PilotWardrobe inventory ✓ Full warranty ✓ Fast shipping
                </span>
              </p>
            </div>

            <Link
              href="/official-store"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-blue font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-blue-200"
            >
              <span>Explore Marketplace</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Official Store Badge */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl border border-blue-200/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">PilotWardrobe Verified</h3>
              <p className="text-sm text-gray-600">Quality guaranteed products from our official inventory</p>
            </div>
          </div>
        </div>

        {/* Product Grid - Modern Layout */}
        {pilotWardrobeProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pilotWardrobeProducts.map((item) => (
                <div key={item.id} className="relative">
                  {/* Official Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      
                    </div>
                  </div>
                  
                  <ProductItem item={item} />
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{pilotWardrobeProducts.length}+</div>
                  <div className="text-sm text-gray-600">Official Products</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-sm text-gray-600">Quality Guarantee</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24h</div>
                  <div className="text-sm text-gray-600">Dispatch Time</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1 Year</div>
                  <div className="text-sm text-gray-600">Warranty</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Fallback if no PilotWardrobe products found
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Official Products Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Check back soon for our latest official PilotWardrobe products
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestListings;