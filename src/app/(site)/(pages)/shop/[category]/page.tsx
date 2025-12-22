// app/shop/[category]/page.tsx

import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleGridItem from "@/components/Shop/SingleGridItem";
import shopData from "@/components/Shop/shopData";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import AIUniformRecommender from "@/components/Shop/AIUniformRecommender"; // Your AI component

type Props = {
  params: Promise<{ category: string }>;
};

export const metadata: Metadata = {
  title: "Shop Category | PilotWardrobe",
  description: "Browse premium pre-owned aviation gear by category.",
};
export async function generateStaticParams() {
  const categoryMap = shopData.map((item) => {
    const title = item.title.toLowerCase();
    if (title.includes("uniform") || title.includes("epaulette") || title.includes("shirt") || title.includes("pants")) return "uniforms";
    if (title.includes("headset")) return "headsets";
    if (title.includes("bag")) return "flight-bags";
    if (title.includes("watch")) return "watches";
    if (title.includes("sunglasses")) return "sunglasses";
    return "accessories";
  });

  // Remove duplicates manually (safe for all targets)
  const uniqueCategories = categoryMap.filter((category, index) => 
    categoryMap.indexOf(category) === index
  );

  return uniqueCategories.map((category) => ({
    category,
  }));
}
const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;

  // Normalize category name
  const normalizedCategory = category.toLowerCase().replace("-", " ");

  // Filter products (simple keyword match for now)
  const filteredProducts = shopData.filter((item) => {
    const title = item.title.toLowerCase();
    if (category === "uniforms") return title.includes("uniform") || title.includes("epaulette") || title.includes("shirt") || title.includes("pants");
    if (category === "headsets") return title.includes("headset") || title.includes("bose") || title.includes("lightspeed") || title.includes("david clark");
    if (category === "flight-bags") return title.includes("bag") || title.includes("kneeboard");
    if (category === "watches") return title.includes("watch") || title.includes("garmin");
    if (category === "sunglasses") return title.includes("sunglasses") || title.includes("aviator");
    return false;
  });

  if (filteredProducts.length === 0) {
    notFound();
  }

  return (
    <>
      <Breadcrumb
        title={`${category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}`}
        pages={["Home", "Shop", category]}
      />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <h1 className="text-4xl font-bold text-center mb-12">
            {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
          </h1>

          {/* AI Recommender for Uniforms */}
          {category === "uniforms" && (
            <div className="mb-16">
              <AIUniformRecommender />
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((item) => (
              <SingleGridItem key={item.id} item={item} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-dark-4">No products found in this category yet.</p>
              <p className="text-dark-4 mt-4">Check back soon — new listings added daily!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CategoryPage; // ← THIS LINE WAS MISSING OR WRONG!