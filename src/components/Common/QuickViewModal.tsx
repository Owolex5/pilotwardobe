// src/components/Common/QuickViewModal.tsx (or your exact path)

"use client";

import React, { useEffect, useState } from "react";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { updateproductDetails } from "@/redux/features/product-details";
import Image from "next/image";
import Link from "next/link";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const product = useAppSelector((state) => state.quickViewReducer.value);
  const [activePreview, setActivePreview] = useState(0);

  const handlePreviewSlider = () => {
    dispatch(updateproductDetails(product));
    openPreviewModal();
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...product,
        quantity,
      })
    );
    closeModal();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".modal-content")) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setQuantity(1);
      setActivePreview(0);
    };
  }, [isModalOpen, closeModal]);

  if (!product || !product.imgs) return null;

  // Safely get current image
  const currentImage =
    (activePreview < product.imgs.previews.length && product.imgs.previews[activePreview]) ||
    product.imgs.previews[0];

  const hasValidImage = currentImage && typeof currentImage === "string" && currentImage.trim() !== "";

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 ${
        isModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="modal-content w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-dark shadow-lg hover:bg-white hover:text-blue transition"
          aria-label="Close modal"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="relative bg-gray-50 p-8">
            {/* Main Image - Safe Rendering */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              {hasValidImage ? (
                <Image
                  src={currentImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-3 text-sm">No image available</p>
                  </div>
                </div>
              )}

              {/* Zoom Button */}
              <button
                onClick={handlePreviewSlider}
                className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-dark shadow-lg hover:bg-white hover:text-blue transition"
                aria-label="Zoom"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Thumbnails - Safe Rendering */}
            {product.imgs.thumbnails && product.imgs.thumbnails.length > 1 && (
              <div className="mt-6 flex gap-4 justify-center flex-wrap">
                {product.imgs.thumbnails.map((thumb: string, index: number) => {
                  const isValidThumb = thumb && typeof thumb === "string" && thumb.trim() !== "";
                  return (
                    <button
                      key={index}
                      onClick={() => setActivePreview(index)}
                      className={`relative h-20 w-20 overflow-hidden rounded-xl border-4 transition ${
                        activePreview === index ? "border-blue" : "border-transparent"
                      }`}
                    >
                      {isValidThumb ? (
                        <Image src={thumb} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-200">
                          <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="p-8 lg:p-12">
            <div className="mb-6">
              <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                In Stock
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">
              {product.title}
            </h2>

            {/* Reviews */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-dark-4">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-blue">
                  ${product.discountedPrice.toFixed(2)}
                </span>
                {product.discountedPrice < product.price && (
                  <span className="text-2xl text-dark-4 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              {product.discountedPrice < product.price && (
                <p className="mt-2 text-green-600 font-semibold">
                  You save ${(product.price - product.discountedPrice).toFixed(2)}!
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-dark mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-20 text-center text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-blue text-white font-bold text-lg rounded-xl hover:bg-blue-dark transition shadow-lg"
              >
                Add to Cart
              </button>
              <Link
                href={`/shop-details/${product.id}`}
                className="w-full py-4 border-2 border-blue text-blue font-bold text-lg rounded-xl hover:bg-blue hover:text-white transition text-center"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;