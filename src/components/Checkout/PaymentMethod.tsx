"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState("flutterwave");

  return (
    <div className="bg-white rounded-2xl shadow-lg mt-8">
      <div className="border-b border-gray-200 py-6 px-8">
        <h3 className="text-2xl font-bold text-dark">Payment Method</h3>
      </div>

      <div className="p-8 space-y-6">
        {/* Flutterwave */}
        <label className="flex items-center gap-5 cursor-pointer group">
          <div className="relative">
            <input
              type="radio"
              name="payment"
              value="flutterwave"
              checked={selectedMethod === "flutterwave"} // ← Always defined
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="sr-only"
            />
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMethod === "flutterwave"
                  ? "border-blue bg-blue"
                  : "border-gray-400 group-hover:border-blue"
              }`}
            >
              {selectedMethod === "flutterwave" && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
          </div>

          <div
            className={`flex-1 flex items-center justify-between py-5 px-6 rounded-xl transition-all ${
              selectedMethod === "flutterwave"
                ? "bg-blue-50 border border-blue"
                : "bg-gray-50 border border-transparent group-hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <Image
                src="/images/pward/flutterwaves-removebg-preview.png"
                alt="Flutterwave"
                width={18}
                height={8}
                className="object-contain"
              />
              <div>
                <p className="font-semibold text-dark">Pay with Flutterwave</p>
                <p className="text-sm text-dark-4">
                  Card, Bank Transfer, USSD, Mobile Money
                </p>
              </div>
            </div>
        
          </div>
        </label>

        {/* Cash on Delivery */}
        {/* <label className="flex items-center gap-5 cursor-pointer group">
          <div className="relative">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={selectedMethod === "cod"} // ← Always defined
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="sr-only"
            />
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMethod === "cod"
                  ? "border-blue bg-blue"
                  : "border-gray-400 group-hover:border-blue"
              }`}
            >
              {selectedMethod === "cod" && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
          </div>

          <div
            className={`flex-1 flex items-center gap-4 py-5 px-6 rounded-xl transition-all ${
              selectedMethod === "cod"
                ? "bg-blue-50 border border-blue"
                : "bg-gray-50 border border-transparent group-hover:bg-gray-100"
            }`}
          >
            <Image
              src="/images/checkout/cash.svg"
              alt="Cash on delivery"
              width={28}
              height={28}
            />
            <div>
              <p className="font-semibold text-dark">Cash on Delivery</p>
              <p className="text-sm text-dark-4">Pay when you receive your order</p>
            </div>
          </div>
        </label> */}

        {/* Propose an Exchange */}
        <label className="flex items-center gap-5 cursor-pointer group">
          <div className="relative">
            <input
              type="radio"
              name="payment"
              value="exchange"
              checked={selectedMethod === "exchange"} // ← Always defined
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="sr-only"
            />
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMethod === "exchange"
                  ? "border-green-600 bg-green-600"
                  : "border-gray-400 group-hover:border-green-600"
              }`}
            >
              {selectedMethod === "exchange" && (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
          </div>

          <div
            className={`flex-1 flex items-center gap-4 py-5 px-6 rounded-xl transition-all ${
              selectedMethod === "exchange"
                ? "bg-green-50 border border-green-600"
                : "bg-gray-50 border border-transparent group-hover:bg-green-50"
            }`}
          >
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4 4m4-4l-4-4m0 12H4m0 0l4-4m-4 4l4 4" />
            </svg>

            <div>
              <p className="font-semibold text-dark">Propose an Exchange / Swap</p>
              <p className="text-sm text-dark-4">
                Trade your current gear toward this purchase
              </p>
            </div>
          </div>
        </label>

        {/* Extra info when exchange selected */}
        {selectedMethod === "exchange" && (
          <div className="ml-11 p-6 bg-green-50 rounded-xl border border-green-200">
            <p className="text-dark mb-4">
              Offer your headset, uniform, or flight bag as trade-in credit.
            </p>
            <Link
              href="/exchange"
              className="inline-flex items-center font-semibold text-green-700 hover:underline"
            >
              Start Exchange Proposal →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;