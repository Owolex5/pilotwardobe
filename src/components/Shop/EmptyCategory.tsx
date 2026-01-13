// components/Shop/EmptyCategory.tsx
import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";

interface EmptyCategoryProps {
  category: string;
  displayCategory?: string;
}

const EmptyCategory = ({ category, displayCategory }: EmptyCategoryProps) => {
  const categoryName = displayCategory || 
    category.split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace("Aircraft", "Aircraft ");

  const getCategoryIcon = () => {
    switch(category) {
      case "sunglasses":
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case "aircraft-parts":
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "epaulettes":
      case "wings":
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        );
    }
  };

  const getCategoryDescription = () => {
    switch(category) {
      case "sunglasses":
        return "Premium aviation sunglasses and eyewear are coming soon!";
      case "aircraft-parts":
        return "Genuine aircraft parts and components will be available shortly.";
      case "epaulettes":
        return "Professional pilot epaulettes and shoulder boards coming soon.";
      case "wings":
        return "Pilot wings and aviation badges will be available shortly.";
      default:
        return `Our ${categoryName.toLowerCase()} collection is coming soon!`;
    }
  };

  const getRelatedCategories = () => {
    switch(category) {
      case "sunglasses":
      case "aircraft-parts":
      case "epaulettes":
      case "wings":
        return [
          { name: "Uniforms", href: "/shop/uniforms" },
          { name: "Watches", href: "/shop/watches" },
          { name: "Headsets", href: "/shop/headsets" },
          { name: "Accessories", href: "/shop/accessories" }
        ];
      default:
        return [
          { name: "All Categories", href: "/shop" },
          { name: "Uniforms", href: "/shop/uniforms" },
          { name: "Headsets", href: "/shop/headsets" },
          { name: "Flight Bags", href: "/shop/flight-bags" }
        ];
    }
  };

  return (
    <>
      <Breadcrumb
        title={categoryName}
        pages={["Home", "Shop", categoryName]}
      />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-8">
              {getCategoryIcon()}
            </div>
            
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
              <span>Coming Soon</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {categoryName}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {getCategoryDescription()}
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Notify Me When Available</h3>
              <p className="text-gray-600 mb-6">
                Be the first to know when we add products to this category.
              </p>
              <form className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-blue font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    Notify Me
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  We'll email you when new {categoryName.toLowerCase()} are added.
                </p>
              </form>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse Related Categories</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {getRelatedCategories().map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sell Your {categoryName}</h3>
              <p className="text-gray-600 mb-6">
                Have {categoryName.toLowerCase()} to sell? List them on PilotWardrobe and reach thousands of aviation professionals.
              </p>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-blue font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
              >
                Start Selling
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmptyCategory;