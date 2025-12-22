"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Newsletter from "../Common/Newsletter";
import RecentlyViewedItems from "./RecentlyViewed"; // Correct relative import

import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";

const ShopDetails = () => {
  const [activeColor] = useState("blue"); // You weren't using setActiveColor, so removed it
  const { openPreviewModal } = usePreviewSlider();
  const [previewImg, setPreviewImg] = useState(0);

  const [storage, setStorage] = useState("gb128");
  const [type, setType] = useState("active");
  const [sim, setSim] = useState("dual");
  const [quantity, setQuantity] = useState(1);

  const [activeTab] = useState("tabOne"); // Not used in visible code yet, but kept

  const storages = [
    { id: "gb128", title: "128 GB" },
    { id: "gb256", title: "256 GB" },
    { id: "gb512", title: "512 GB" }, // Fixed typo: was "521 GB"
  ];

  const types = [
    { id: "active", title: "Active" },
    { id: "inactive", title: "Inactive" },
  ];

  const sims = [
    { id: "dual", title: "Dual" },
    { id: "e-sim", title: "E-Sim" },
  ];

  const tabs = [
    { id: "tabOne", title: "Description" },
    { id: "tabTwo", title: "Additional Information" },
    { id: "tabThree", title: "Reviews" },
  ];

  const colors = ["red", "blue", "orange", "pink", "purple"];

  // Get product from localStorage or Redux
  const alreadyExist =
    typeof window !== "undefined" && localStorage.getItem("productDetails");
  const productFromStorage = useAppSelector(
    (state) => state.productDetailsReducer.value
  );

  const product = alreadyExist
    ? JSON.parse(alreadyExist as string)
    : productFromStorage;

  // Sync product to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && product) {
      localStorage.setItem("productDetails", JSON.stringify(product));
    }
  }, [product]);

  const handlePreviewSlider = () => {
    openPreviewModal();
  };

  return (
    <>
      <Breadcrumb title="Shop Details" pages={["shop details"]} />

      {product?.title ? (
        <>
          <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
                {/* Product Images */}
                <div className="lg:max-w-[570px] w-full">
                  <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                    <button
                      onClick={handlePreviewSlider}
                      aria-label="Zoom product image"
                      className="absolute top-4 lg:top-6 right-4 lg:right-6 z-50 w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center hover:text-blue transition"
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>

                    {product.imgs?.previews?.[previewImg] && (
                      <Image
                        src={product.imgs.previews[previewImg]}
                        alt={product.title || "Product detail"}
                        width={400}
                        height={400}
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                    {product.imgs?.thumbnails?.map((item: string, key: number) => (
                      <button
                        onClick={() => setPreviewImg(key)}
                        key={key}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 border-2 hover:border-blue transition ${
                          key === previewImg ? "border-blue" : "border-transparent"
                        }`}
                      >
                        <Image
                          width={80}
                          height={80}
                          src={item}
                          alt={`Thumbnail ${key + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Details (Title, Price, Options, Tabs, etc.) */}
                <div className="max-w-[539px] w-full">
                  {/* You can expand this section with title, price, color picker, quantity, add to cart, tabs, etc. */}
                  <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                  <p className="text-2xl font-semibold text-blue mb-6">
                    ${product.price || "N/A"}
                  </p>

                  {/* Example: Color, Storage, Type, SIM selection can go here */}
                  {/* ... your form/options here ... */}

                  {/* Tabs: Description, Additional Info, Reviews */}
                  {/* ... implement tabs if needed ... */}
                </div>
              </div>
            </div>
          </section>

          {/* Recently Viewed Items Section */}
          <RecentlyViewedItems />

          {/* Newsletter Signup */}
          <Newsletter />
        </>
      ) : (
        <div className="text-center py-20 text-xl text-gray-500">
          No product selected. Please go back and choose a product.
        </div>
      )}
    </>
  );
};

export default ShopDetails;