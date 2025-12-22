"use client";
import React, { useState } from "react";
import Link from "next/link";

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-8 text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-dark">
          Have an account? Log in for faster checkout
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
          <p className="text-dark-4 mb-6">
            Log in to save your address, track orders, and manage your listings.
          </p>

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
                placeholder="you@pilotwardrobe.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:bg-blue-dark transition shadow-md"
              >
                Log In
              </button>
            </div>

            <p className="text-center text-sm text-dark-4">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;