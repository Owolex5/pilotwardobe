"use client";
import React from "react";
import Discount from "./Discount";
import OrderSummary from "./OrderSummary";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const dispatch = useAppDispatch();

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      dispatch(removeAllItemsFromCart());
    }
  };

  return (
    <>
      {/* <!-- ===== Breadcrumb Section Start ===== --> */}
      <section>
        <Breadcrumb title={"Cart"} pages={["Cart"]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
      
      {cartItems.length > 0 ? (
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <h2 className="font-medium text-dark text-2xl">Your Cart</h2>
              <button 
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                Clear Shopping Cart
              </button>
            </div>

            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  {/* <!-- table header - Updated for size --> */}
                  <div className="flex items-center py-5.5 px-7.5 border-b border-gray-200">
                    <div className="min-w-[400px]">
                      <p className="text-dark font-medium">Product Details</p>
                    </div>

                    <div className="min-w-[180px]">
                      <p className="text-dark font-medium">Unit Price</p>
                    </div>

                    <div className="min-w-[200px]">
                      <p className="text-dark font-medium">Quantity</p>
                    </div>

                    <div className="min-w-[180px]">
                      <p className="text-dark font-medium">Subtotal</p>
                    </div>

                    <div className="min-w-[50px]">
                      <p className="text-dark font-medium text-right">Actions</p>
                    </div>
                  </div>

                  {/* <!-- cart items --> */}
                  {cartItems.map((item, key) => (
                    <SingleItem item={item} key={key} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
              <Discount />
              <OrderSummary />
            </div>

            {/* Continue Shopping & Checkout Buttons */}
            <div className="flex flex-wrap gap-4 justify-between mt-12">
              <Link
                href="/shop"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                ← Continue Shopping
              </Link>
              
              <div className="flex gap-4">
                <button
                  onClick={handleClearCart}
                  className="px-8 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  Clear Cart
                </button>
                <Link
                  href="/checkout"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Proceed to Checkout →
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h18l-2 12H5L3 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 16a2 2 0 11-4 0 2 2 0 014 0zM6 16a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping →
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;