// components/Shop/CategoryStats.tsx
"use client";

import React from "react";

interface CategoryStatsProps {
  products: any[];
}

const CategoryStats = ({ products }: CategoryStatsProps) => {
  const officialProducts = products.filter(p => p.seller === "PilotWardrobe").length;
  const avgPrice = products.reduce((sum, p) => sum + (p.discountedPrice || p.price), 0) / products.length;
  const onSaleProducts = products.filter(p => p.discountedPrice && p.discountedPrice < p.price).length;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
          <div className="text-2xl font-bold text-blue-700 mb-2">{products.length}</div>
          <div className="text-sm text-blue-600">Total Products</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
          <div className="text-2xl font-bold text-green-700 mb-2">{officialProducts}</div>
          <div className="text-sm text-green-600">Official Store Items</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5">
          <div className="text-2xl font-bold text-red-700 mb-2">{onSaleProducts}</div>
          <div className="text-sm text-red-600">On Sale</div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;