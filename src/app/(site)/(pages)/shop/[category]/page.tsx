// app/shop/[category]/page.tsx
import React from "react";
import shopData from "@/components/Shop/shopData";
import { Metadata } from "next";
import CategoryContent from "./CategoryContent";
import EmptyCategory from "@/components/Shop/EmptyCategory";

type Props = {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Shop Category | PilotWardrobe",
  description: "Browse premium pre-owned aviation gear by category.",
};

// Define ALL valid categories (even if empty for now)
const ALL_CATEGORIES = [
  "uniforms",
  "headsets", 
  "flight-bags",
  "watches",
  "sunglasses",
  "aircraft-parts",
  "manuals-documents",
  "models-collectibles",
  "accessories",
  "epaulettes",
  "wings",
  "shirts",
  "pants"
];

export async function generateStaticParams() {
  return ALL_CATEGORIES.map((category) => ({
    category,
  }));
}

export const dynamicParams = true;

const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;

  // Normalize category name for display
  const displayCategory = category
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("Aircraft", "Aircraft ");

  // Filter products based on category - FIXED VERSION
  const filteredProducts = shopData.filter((item: any) => { // Use 'any' to bypass type checking
    const title = item.title.toLowerCase();
    // Check if description exists, use it if it does
    const desc = item.description ? item.description.toLowerCase() : "";
    
    switch(category) {
      case "uniforms":
      case "epaulettes":
      case "wings":
      case "shirts":
      case "pants":
        return (
          title.includes("uniform") || 
          title.includes("epaulette") || 
          title.includes("epaulet") ||
          title.includes("shirt") || 
          title.includes("pants") ||
          title.includes("trouser") ||
          title.includes("jacket") ||
          title.includes("blazer") ||
          title.includes("tie") ||
          title.includes("wing") ||
          title.includes("badge") ||
          title.includes("insignia") ||
          desc.includes("uniform") ||
          desc.includes("epaulette")
        );
      
      case "headsets":
        return (
          title.includes("headset") || 
          title.includes("headphone") ||
          title.includes("bose") || 
          title.includes("lightspeed") || 
          title.includes("david clark") ||
          title.includes("dc") ||
          title.includes("head gear") ||
          desc.includes("headset") ||
          desc.includes("aviation headphone")
        );
      
      case "flight-bags":
        return (
          title.includes("bag") || 
          title.includes("kneeboard") ||
          title.includes("luggage") || 
          title.includes("case") ||
          title.includes("backpack") ||
          title.includes("carry") ||
          title.includes("briefcase") ||
          desc.includes("flight bag") ||
          desc.includes("pilot bag")
        );
      
      case "watches":
        return (
          title.includes("watch") || 
          title.includes("garmin") || 
          title.includes("timepiece") ||
          title.includes("wrist") ||
          title.includes("chronograph") ||
          desc.includes("aviation watch") ||
          desc.includes("pilot watch")
        );
      
      case "sunglasses":
        return (
          title.includes("sunglass") || 
          title.includes("aviator") || 
          title.includes("ray-ban") || 
          title.includes("oakley") ||
          title.includes("eyewear") ||
          title.includes("glasses") ||
          desc.includes("sunglass") ||
          desc.includes("aviator")
        );
      
      case "aircraft-parts":
        return (
          title.includes("part") || 
          title.includes("component") || 
          title.includes("instrument") || 
          title.includes("gauge") ||
          title.includes("panel") ||
          title.includes("switch") ||
          title.includes("control") ||
          title.includes("avionics") ||
          desc.includes("aircraft part") ||
          desc.includes("aviation component")
        );
      
      case "manuals-documents":
        return (
          title.includes("manual") || 
          title.includes("book") || 
          title.includes("guide") ||
          title.includes("document") ||
          title.includes("logbook") ||
          title.includes("chart") ||
          title.includes("map") ||
          desc.includes("manual") ||
          desc.includes("aviation guide")
        );
      
      case "models-collectibles":
        return (
          title.includes("model") || 
          title.includes("toy") || 
          title.includes("collectible") ||
          title.includes("diecast") ||
          title.includes("replica") ||
          title.includes("display") ||
          desc.includes("model aircraft") ||
          desc.includes("collectible")
        );
      
      case "accessories":
        // Everything that doesn't fit other categories
        return !(
          title.includes("uniform") || 
          title.includes("epaulette") || 
          title.includes("epaulet") ||
          title.includes("shirt") || 
          title.includes("pants") ||
          title.includes("headset") || 
          title.includes("bose") || 
          title.includes("lightspeed") || 
          title.includes("david clark") ||
          title.includes("bag") || 
          title.includes("kneeboard") ||
          title.includes("watch") || 
          title.includes("garmin") ||
          title.includes("sunglass") || 
          title.includes("aviator") || 
          title.includes("ray-ban") || 
          title.includes("oakley") ||
          title.includes("part") || 
          title.includes("component") || 
          title.includes("instrument") || 
          title.includes("gauge") ||
          title.includes("manual") || 
          title.includes("book") || 
          title.includes("guide") ||
          title.includes("model") || 
          title.includes("toy") || 
          title.includes("collectible")
        );
      
      default:
        return false;
    }
  });

  // Instead of showing 404, show empty state with fallback
  if (filteredProducts.length === 0) {
    return <EmptyCategory category={category} displayCategory={displayCategory} />;
  }

  return (
    <CategoryContent 
      category={category}
      displayCategory={displayCategory}
      filteredProducts={filteredProducts}
    />
  );
};

export default CategoryPage;