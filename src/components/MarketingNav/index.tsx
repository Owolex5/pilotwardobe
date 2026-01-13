// components/MarketingNav.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User, ShoppingBag } from "lucide-react";

const MarketingNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PW</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                Pilot<span className="text-blue-600">Wardrobe</span>
              </h1>
              <p className="text-xs text-gray-500">Professional Aviation Gear</p>
            </div>
          </Link>

          {/* Desktop Navigation - MARKETING FOCUSED */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-700 hover:text-blue-600 font-medium">
              Why PilotWardrobe
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                Gear Categories <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg mt-2 p-4 w-48">
                <Link href="/shop/headsets" className="block py-2 px-3 hover:bg-blue-50 rounded">Headsets</Link>
                <Link href="/shop/uniforms" className="block py-2 px-3 hover:bg-blue-50 rounded">Uniforms</Link>
                <Link href="/shop/watches" className="block py-2 px-3 hover:bg-blue-50 rounded">Watches</Link>
                <Link href="/shop/flight-bags" className="block py-2 px-3 hover:bg-blue-50 rounded">Flight Bags</Link>
              </div>
            </div>
            <Link href="/sell" className="text-gray-700 hover:text-blue-600 font-medium">
              Sell Your Gear
            </Link>
            <Link href="/pilot-resources" className="text-gray-700 hover:text-blue-600 font-medium">
              Pilot Resources
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              About Us
            </Link>
          </div>

          {/* CTA Buttons - Different from marketplace */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              href="/shop" 
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Gear</span>
            </Link>
            <Link 
              href="/signin" 
              className="flex items-center space-x-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition"
            >
              <User className="w-4 h-4" />
              <span>Pilot Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t py-4">
            <div className="flex flex-col space-y-4 px-4">
              <Link href="/#features" className="py-2">Why PilotWardrobe</Link>
              <Link href="/shop" className="py-2">Gear Categories</Link>
              <Link href="/sell" className="py-2">Sell Your Gear</Link>
              <Link href="/pilot-resources" className="py-2">Pilot Resources</Link>
              <Link href="/about" className="py-2">About Us</Link>
              <div className="pt-4 space-y-2">
                <Link href="/shop" className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg">
                  Browse Gear
                </Link>
                <Link href="/signin" className="block w-full border border-blue-600 text-blue-600 text-center py-3 rounded-lg">
                  Pilot Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MarketingNav;