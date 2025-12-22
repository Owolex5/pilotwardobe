// src/components/Shop/SingleGridItem.tsx

"use client";

import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";

const SingleGridItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        quantity: 1,
      })
    );
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/shop-details/${item.id}`}>
          <Image
            src={item.imgs.previews[0]}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </Link>

        {/* Hover Action Buttons */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/70 to-transparent py-5">
          <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            aria-label="Quick view"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-dark shadow-lg hover:bg-blue hover:text-white transition"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-blue text-white font-semibold text-sm rounded-full shadow-lg hover:bg-blue-dark transition"
          >
            Add to Cart
          </button>

          <button
            onClick={handleItemToWishList}
            aria-label="Add to wishlist"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-dark shadow-lg hover:bg-red-500 hover:text-white transition"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Discount Badge */}
        {item.discountedPrice < item.price && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            Save ${(item.price - item.discountedPrice).toFixed(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        {/* Reviews */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Image
              key={i}
              src="/images/icons/icon-star.svg"
              alt="star"
              width={16}
              height={16}
              className="text-yellow-400"
            />
          ))}
          <span className="ml-2 text-sm text-dark-4">({item.reviews})</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-dark line-clamp-2 mb-3 hover:text-blue transition">
          <Link href={`/shop-details/${item.id}`}>
            {item.title}
          </Link>
        </h3>

        {/* Price */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl font-bold text-blue">
            ${item.discountedPrice.toFixed(2)}
          </span>
          {item.discountedPrice < item.price && (
            <span className="text-lg text-dark-4 line-through">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleGridItem;