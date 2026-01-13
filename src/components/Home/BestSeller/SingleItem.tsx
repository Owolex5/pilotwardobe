"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";

const SingleItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="group bg-white rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-transparent hover:border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-square mb-6 overflow-hidden rounded-xl bg-[#F9FAFB]">
        {/* Discount Badge */}
        {item.discountedPrice && (
          <div className="absolute top-3 left-3 z-10 bg-red text-white text-[10px] font-black px-2 py-1 rounded tracking-tighter uppercase">
            {Math.round(((item.price - item.discountedPrice) / item.price) * 100)}% OFF
          </div>
        )}

        {/* Hover Actions Rail */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={() => dispatch(addItemToWishlist({ ...item, quantity: 1 }))}
            className="w-9 h-9 bg-white shadow-sm rounded-full flex items-center justify-center text-dark hover:bg-blue hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          <button 
            onClick={() => { dispatch(updateQuickView({ ...item })); openModal(); }}
            className="w-9 h-9 bg-white shadow-sm rounded-full flex items-center justify-center text-dark hover:bg-blue hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </button>
        </div>

        <Link href={`/shop-details/${item.id}`} className="block w-full h-full">
          <Image
            src={item.imgs.previews[0]}
            alt={item.title}
            fill
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        
        {/* Quick Add To Cart Bar */}
        <button 
          onClick={() => dispatch(addItemToCart({ ...item, quantity: 1 }))}
          className="absolute inset-x-0 bottom-0 bg-dark text-white text-[11px] font-bold py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 uppercase tracking-widest"
        >
          Add to cart
        </button>
      </div>

      {/* Meta Info */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>{item.category || "Essentials"}</span>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span className="text-dark">({item.reviews})</span>
          </div>
        </div>

        <Link href={`/shop-details/${item.id}`} className="font-bold text-dark text-md hover:text-blue transition-colors line-clamp-1">
          {item.title}
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-black text-dark">${item.discountedPrice || item.price}</span>
          {item.discountedPrice && (
            <span className="text-xs text-gray-400 line-through font-medium">${item.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleItem;