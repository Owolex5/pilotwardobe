import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useSelector } from "react-redux";
import React from "react";
import Link from "next/link";

const OrderSummary = () => {
  const totalPrice = useSelector(selectTotalPrice);

  return (
    <div className="lg:max-w-[455px] w-full">
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Order Summary</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* Subtotal Breakdown */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <h4 className="font-medium text-dark">Product</h4>
            <h4 className="font-medium text-dark text-right">Subtotal</h4>
          </div>

          {/* Individual Items */}
          {/* Note: We don't need cartItems here for display since ProductItem already shows details in the table */}
          {/* If you want to show a compact list here, you can add it later */}

          {/* Total Amount */}
          <div className="flex items-center justify-between pt-6 pb-8">
            <p className="font-medium text-lg text-dark">Total</p>
            <p className="font-bold text-2xl text-blue text-right">
              ${totalPrice.toFixed(2)}
            </p>
          </div>

          {/* Checkout Button - Now a proper Link */}
          <Link
            href="/checkout"
            className="w-full block text-center font-medium text-white bg-blue py-4 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 shadow-lg transition"
          >
            Proceed to Checkout
          </Link>

          <p className="text-center text-dark-4 text-sm mt-5">
            Secure checkout • Worldwide shipping • 30-day returns
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;