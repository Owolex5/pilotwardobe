// src/app/shop-details/[id]/page.tsx

import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import { notFound } from "next/navigation";
import Newsletter from "@/components/Common/Newsletter";
import RecentlyViewedItems from "@/components/ShopDetails/RecentlyViewed";
import AIUniformRecommender from "@/components/Shop/AIUniformRecommender";

async function getProduct(id: string) {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("productDetails");
    if (stored) {
      const product = JSON.parse(stored);
      if (product.id === parseInt(id)) return product;
    }
  }

  const shopData = (await import("@/components/Shop/shopData")).default;
  const product = shopData.find((p: any) => p.id === parseInt(id));
  return product || null;
}

const isUniformProduct = (product: any) => {
  const uniformKeywords = ["shirt", "pants", "jacket", "uniform", "epaulette", "trousers"];
  return uniformKeywords.some((kw) => product.title.toLowerCase().includes(kw));
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const showRecommender = isUniformProduct(product);

  return (
    <>
      <Breadcrumb title={product.title} pages={["Home", "Shop", product.title]} />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-2xl">
                <Image
                  src={product.imgs.previews[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {product.imgs.thumbnails && product.imgs.thumbnails.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.imgs.thumbnails.map((thumb: string, i: number) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg"
                    >
                      <Image src={thumb} alt={`View ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">{product.title}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-dark-4">({product.reviews} reviews)</span>
                  <span className="text-green-600 font-semibold">In Stock</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-blue">
                    ${product.discountedPrice.toFixed(2)}
                  </span>
                  {product.discountedPrice < product.price && (
                    <span className="text-3xl text-dark-4 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {product.discountedPrice < product.price && (
                  <p className="text-xl font-semibold text-green-600 mt-2">
                    Save ${(product.price - product.discountedPrice).toFixed(2)}!
                  </p>
                )}
              </div>

              {/* AI Uniform Recommender - Only for uniforms */}
              {showRecommender && (
                <div className="mt-12">
                  <AIUniformRecommender />
                </div>
              )}

              <div className="prose prose-lg max-w-none text-dark-4">
                <p>
                  Pre-owned and pilot-verified. Excellent condition with full functionality.
                  Perfect for upgrading your cockpit without the new price tag.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-blue">✓</span> Verified by licensed pilot
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue">✓</span> 30-day satisfaction guarantee
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-blue">✓</span> Free shipping on orders over $500
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <button className="flex-1 py-5 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-xl">
                  Add to Cart
                </button>
                <button className="flex-1 py-5 border-2 border-blue text-blue font-bold text-xl rounded-2xl hover:bg-blue hover:text-white transition">
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewedItems />
      <Newsletter />
    </>
  );
}