"use client";

import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import { Shield } from "lucide-react";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Checkout = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const subtotal = useAppSelector(selectTotalPrice);
  const shipping = 15.0; // Can be dynamic later (based on ShippingMethod)
  const total = subtotal + shipping;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate API call to create order (replace with real Supabase/Stripe logic)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success: redirect to thank-you or order confirmation
      window.location.href = "/order-confirmation"; // or use router.push
    } catch (err) {
      setSubmitError("Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18l-2 12H5L3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16a2 2 0 11-4 0 2 2 0 014 0zM6 16a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any aviation gear yet.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg"
          >
            Start Shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title="Checkout" pages={["Home", "Cart", "Checkout"]} />

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-8">
                {/* Login / Guest */}
                <Login />

                {/* Billing Details */}
                <Billing />

                {/* Shipping Address */}
                <Shipping />

                {/* Additional Notes */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-5">
                    Additional Information
                  </h3>
                  <textarea
                    name="notes"
                    rows={4}
                    placeholder="Notes about your order (e.g., leave at front desk, gift message, special delivery instructions)"
                    className="w-full px-6 py-5 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition resize-none"
                  />
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h3>

                  {/* Cart Items */}
                  <div className="space-y-6 pb-6 border-b border-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          <Image
                            src={item.imgs.previews[0]}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 text-right">
                          ${(item.discountedPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 py-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Tax</span>
                      <span>Included</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-6">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-blue-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Coupon */}
                  <Coupon />

                  {/* Shipping Method */}
                  <ShippingMethod />

                  {/* Payment Method */}
                  <PaymentMethod />

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full mt-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-blue font-bold text-xl rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Complete Order"
                    )}
                  </motion.button>

                  <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Secure checkout • Encrypted payment • Worldwide delivery
                  </p>

                  {submitError && (
                    <p className="text-red-600 text-center mt-4 bg-red-50 p-3 rounded-xl">
                      {submitError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;