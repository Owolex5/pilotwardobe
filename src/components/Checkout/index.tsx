"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import Image from "next/image";
import Link from "next/link";

const Checkout = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const subtotal = useAppSelector(selectTotalPrice);
  const shipping = 15.0; // You can make this dynamic later
  const total = subtotal + shipping;

  return (
    <>
      <Breadcrumb title="Checkout" pages={["Home", "Checkout"]} />

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <form>
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-8">
                {/* Guest/Login */}
                <Login />

                {/* Billing Details */}
                <Billing />

                {/* Shipping Address */}
                <Shipping />

                {/* Additional Notes */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-dark mb-5">
                    Additional Information
                  </h3>
                  <textarea
                    name="notes"
                    rows={4}
                    placeholder="Notes about your order (e.g., leave at front desk, gift message, special delivery instructions)"
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue/20 transition"
                  />
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                  <h3 className="text-2xl font-bold text-dark mb-6">Your Order</h3>

                  {/* Cart Items */}
                  <div className="space-y-5 pb-6 border-b border-gray-200">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-dark-4 py-8">
                        Your cart is empty
                      </p>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.imgs.previews[0]}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-dark line-clamp-2">
                              {item.title}
                            </p>
                            <p className="text-sm text-dark-4">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-dark text-right">
                            ${(item.discountedPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 py-6 border-b border-gray-200">
                    <div className="flex justify-between text-dark">
                      <span>Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-dark-4">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-dark-4 text-sm">
                      <span>Tax</span>
                      <span>Included</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-6">
                    <span className="text-xl font-bold text-dark">Total</span>
                    <span className="text-3xl font-bold text-blue">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Coupon */}
                  <Coupon />

                  {/* Shipping Method */}
                  <ShippingMethod />

                  {/* Payment Method */}
                  <PaymentMethod />

                  {/* Final Checkout Button */}
                  <button
                    type="submit"
                    disabled={cartItems.length === 0}
                    className="w-full mt-8 py-5 bg-blue text-white font-bold text-xl rounded-xl hover:bg-blue-dark transition shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Complete Order
                  </button>

                  <p className="text-center text-sm text-dark-4 mt-6">
                    <svg className="inline w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure checkout • Encrypted payment • Worldwide delivery
                  </p>
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