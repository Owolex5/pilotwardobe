// src/components/RequestItem.tsx

"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

const RequestItem = () => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [budget, setBudget] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    "Headsets",
    "Uniforms",
    "Flight Bags",
    "Watches",
    "Kneeboards",
    "Sunglasses",
    "Logbooks",
    "Drones",
    "Avionics",
    "Engines & Props",
    "Airframe Parts",
    "Instruments",
    "Interior",
    "Other Aircraft Parts",
    "Other Gear",
  ];

  const conditions = [
    "New",
    "Like New",
    "Good Working",
    "For Parts/Repair",
    "As-Is",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("item_requests")
      .insert([
        {
          user_id: user?.id,
          description,
          category,
          condition,
          budget: budget ? parseFloat(budget) : null,
          email: email || user?.email,
        },
      ]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left: Form */}
        <div className="p-8 lg:p-16 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Request an Item
              </h1>
              <p className="text-lg text-gray-600">
                Can't find what you need? Tell us, and we'll notify you when it's available.
              </p>
            </div>

            {success ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
                <p className="text-gray-600 mb-2">We'll watch for:</p>
                <p className="text-xl font-semibold text-blue-600 mb-6">{description}</p>
                <p className="text-gray-600">You'll be notified at {email} when matching items are listed.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are you looking for? *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    placeholder="e.g., Bose A30 headset in excellent condition or Garmin drone parts for repair"
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                  >
                    <option value="">Any</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Budget (USD, optional)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., 500"
                    min="0"
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting Request..." : "Submit Request"}
                </button>
              </form>
            )}

            <p className="text-center mt-8 text-gray-600">
              Have an account?{" "}
              <Link href="/signin" className="text-blue-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right: Image */}
        <div className="hidden lg:block relative h-full min-h-[600px]">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Professional pilot in uniform preparing for flight"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 text-white max-w-md">
            <h2 className="text-5xl font-bold mb-4">Request Your Gear</h2>
            <p className="text-xl opacity-90">
              Tell us what you need. We'll notify you when it's listed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestItem; // ← Only one export!