"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";  // ← ADD THIS LINE!
import { supabase } from "@/lib/supabase/client";

const Billing = () => {
  const [user, setUser] = useState<any>(null);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    airline: "",
    country: "",
    address: "",
    address2: "",
    city: "",
    phone: "",
    email: "",
  });

  // Fetch logged-in user data
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        // Pre-fill from user_metadata (if you stored full_name during signup)
        const fullName = user.user_metadata?.full_name || "";
        const [first, ...last] = fullName.split(" ");
        
        setBillingInfo(prev => ({
          ...prev,
          firstName: first || "",
          lastName: last.join(" ") || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "", // If you stored phone in metadata
        }));
      }
    };

    fetchUser();

    // Listen for auth changes (in case user logs in/out while on page)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUser(); // Re-fetch details
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl lg:text-3xl font-bold text-dark mb-6">
        Billing Details
      </h2>

      {/* Logged-in Status */}
      {user ? (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-800">
                Logged in as {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </p>
              <p className="text-sm text-green-700">
                Your details are pre-filled below • Faster checkout!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center">
          <p className="text-gray-700">
            <Link href="/signin" className="text-blue-600 font-medium hover:underline">
              Log in
            </Link>{" "}
            for faster checkout and pre-filled details
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-dark mb-2">
              First Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={billingInfo.firstName}
              onChange={handleChange}
              placeholder="John"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-dark mb-2">
              Last Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={billingInfo.lastName}
              onChange={handleChange}
              placeholder="Smith"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
            />
          </div>
        </div>

        {/* Airline / Company */}
        <div className="mb-6">
          <label htmlFor="airline" className="block text-sm font-medium text-dark mb-2">
            Airline / Company (optional)
          </label>
          <input
            type="text"
            id="airline"
            name="airline"
            value={billingInfo.airline}
            onChange={handleChange}
            placeholder="e.g., Emirates, Delta Air Lines, Private Owner"
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
          />
          <p className="text-sm text-dark-4 mt-2">
            Helps us verify aviation-related purchases and offer pilot discounts
          </p>
        </div>

        {/* Country / Region */}
        <div className="mb-6">
          <label htmlFor="country" className="block text-sm font-medium text-dark mb-2">
            Country / Region <span className="text-red">*</span>
          </label>
          <select
            id="country"
            name="country"
            value={billingInfo.country}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition appearance-none bg-white"
          >
            <option value="">Select a country</option>
            <option value="AE">United Arab Emirates</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="CA">Canada</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="SA">Saudi Arabia</option>
            <option value="QA">Qatar</option>
            <option value="KW">Kuwait</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Street Address */}
        <div className="mb-6">
          <label htmlFor="address" className="block text-sm font-medium text-dark mb-2">
            Street Address <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={billingInfo.address}
            onChange={handleChange}
            placeholder="House number and street name"
            required
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition mb-4"
          />
          <input
            type="text"
            name="address2"
            value={billingInfo.address2}
            onChange={handleChange}
            placeholder="Apartment, suite, unit, etc. (optional)"
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
          />
        </div>

        {/* Town / City */}
        <div className="mb-6">
          <label htmlFor="city" className="block text-sm font-medium text-dark mb-2">
            Town / City <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={billingInfo.city}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
          />
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-dark mb-2">
              Phone Number <span className="text-red">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={billingInfo.phone}
              onChange={handleChange}
              placeholder="+965 1234 5678"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
              Email Address <span className="text-red">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={billingInfo.email}
              onChange={handleChange}
              placeholder="john@pilot.com"
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
              disabled={!!user} // Disable editing if logged in
            />
            {user && (
              <p className="text-xs text-green-600 mt-1">
                Pre-filled from your account • Edit in profile if needed
              </p>
            )}
          </div>
        </div>

        {/* Create Account Checkbox (hide if already logged in) */}
        {!user && (
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              id="createAccount"
              name="createAccount"
              className="mt-1 w-5 h-5 text-blue border-gray-300 rounded focus:ring-blue"
            />
            <label htmlFor="createAccount" className="text-dark cursor-pointer">
              Create an account for faster checkout next time and to track your orders
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;