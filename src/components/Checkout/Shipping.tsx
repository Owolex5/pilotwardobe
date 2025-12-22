"use client";
import React, { useState } from "react";

const Shipping = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg mt-8 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-8 text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-dark text-lg">
          Ship to a different address?
        </span>
        <svg
          className={`w-5 h-5 text-blue transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-8 pb-8 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country */}
            <div className="md:col-span-2">
              <label htmlFor="shippingCountry" className="block text-sm font-medium text-dark mb-2">
                Country / Region <span className="text-red">*</span>
              </label>
              <select
                id="shippingCountry"
                name="shippingCountry"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition appearance-none bg-white"
              >
                <option value="">Select a country</option>
                <option value="KW">Kuwait</option>
                <option value="AE">United Arab Emirates</option>
                <option value="SA">Saudi Arabia</option>
                <option value="QA">Qatar</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="AU">Australia</option>
                <option value="CA">Canada</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Street Address */}
            <div className="md:col-span-2">
              <label htmlFor="shippingAddress" className="block text-sm font-medium text-dark mb-2">
                Street Address <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="shippingAddress"
                name="shippingAddress"
                placeholder="House number and street name"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition mb-4"
              />
              <input
                type="text"
                name="shippingAddress2"
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
              />
            </div>

            {/* Town / City */}
            <div>
              <label htmlFor="shippingCity" className="block text-sm font-medium text-dark mb-2">
                Town / City <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="shippingCity"
                name="shippingCity"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="shippingPhone" className="block text-sm font-medium text-dark mb-2">
                Phone Number <span className="text-red">*</span>
              </label>
              <input
                type="tel"
                id="shippingPhone"
                name="shippingPhone"
                placeholder="+965 1234 5678"
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;