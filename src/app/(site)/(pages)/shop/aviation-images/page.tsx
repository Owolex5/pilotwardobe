// app/shop/aviation-images/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import { motion } from "framer-motion";

// Mock data for aviation images
const initialImages = [
  {
    id: 1,
    title: "Sunset Over Mountains",
    description: "Beautiful sunset view from cockpit over the Rockies",
    price: 25,
    seller: "Captain John D.",
    sellerRating: 4.9,
    imageUrl: "/images/aviation/sunset-mountains.jpg",
    tags: ["sunset", "mountains", "cockpit-view"],
    resolution: "4K",
    downloads: 142,
    uploadedDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Aurora Borealis Flight",
    description: "Northern Lights view from flight deck over Iceland",
    price: 35,
    seller: "First Officer Sarah L.",
    sellerRating: 4.8,
    imageUrl: "/images/aviation/aurora-flight.jpg",
    tags: ["aurora", "night", "arctic"],
    resolution: "5K",
    downloads: 89,
    uploadedDate: "2024-01-10",
  },
  {
    id: 3,
    title: "Cloud Ocean Sunrise",
    description: "Early morning clouds with golden sunrise",
    price: 20,
    seller: "PilotWardrobe Official",
    sellerRating: 5.0,
    imageUrl: "/images/aviation/cloud-sunrise.jpg",
    tags: ["sunrise", "clouds", "morning"],
    resolution: "4K",
    downloads: 210,
    uploadedDate: "2024-01-05",
  },
  {
    id: 4,
    title: "Storm Clouds Below",
    description: "Dramatic storm clouds viewed from above",
    price: 30,
    seller: "Captain Mike R.",
    sellerRating: 4.7,
    imageUrl: "/images/aviation/storm-clouds.jpg",
    tags: ["storm", "dramatic", "weather"],
    resolution: "6K",
    downloads: 67,
    uploadedDate: "2024-01-18",
  },
  {
    id: 5,
    title: "Alpine Lake Approach",
    description: "Approaching landing with alpine lakes in view",
    price: 28,
    seller: "First Officer Emma K.",
    sellerRating: 4.9,
    imageUrl: "/images/aviation/alpine-lakes.jpg",
    tags: ["mountains", "lakes", "approach"],
    resolution: "4K",
    downloads: 124,
    uploadedDate: "2024-01-12",
  },
  {
    id: 6,
    title: "Night City Lights",
    description: "City lights at night from cruising altitude",
    price: 32,
    seller: "PilotWardrobe Official",
    sellerRating: 5.0,
    imageUrl: "/images/aviation/night-city.jpg",
    tags: ["night", "city", "lights"],
    resolution: "5K",
    downloads: 178,
    uploadedDate: "2024-01-08",
  },
];

const AviationImagesPage = () => {
  const [images, setImages] = useState(initialImages);
  const [filteredImages, setFilteredImages] = useState(initialImages);
  const [priceRange, setPriceRange] = useState([10, 50]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    price: 25,
    tags: "",
    resolution: "4K",
  });

  // Extract all unique tags
  const allTags = Array.from(
    new Set(images.flatMap((img) => img.tags))
  );

  // Filter images based on selections
  useEffect(() => {
    let filtered = [...images];

    // Filter by price range
    filtered = filtered.filter(
      (img) => img.price >= priceRange[0] && img.price <= priceRange[1]
    );

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((img) =>
        selectedTags.some((tag) => img.tags.includes(tag))
      );
    }

    // Sort images
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) =>
          new Date(b.uploadedDate).getTime() -
          new Date(a.uploadedDate).getTime()
        );
        break;
      case "popular":
      default:
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
    }

    setFilteredImages(filtered);
  }, [images, priceRange, selectedTags, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newImage = {
      id: images.length + 1,
      ...uploadForm,
      seller: "You",
      sellerRating: 5.0,
      imageUrl: "/images/aviation/placeholder.jpg", // In real app, this would be uploaded file URL
      tags: uploadForm.tags.split(",").map((tag) => tag.trim()),
      downloads: 0,
      uploadedDate: new Date().toISOString().split("T")[0],
    };

    setImages([newImage, ...images]);
    setUploadForm({
      title: "",
      description: "",
      price: 25,
      tags: "",
      resolution: "4K",
    });
    setShowUploadModal(false);
    setUploading(false);
  };

  const handlePurchase = async (image: any) => {
    // In a real app, this would integrate with a payment system
    alert(`Proceeding to purchase: ${image.title} for $${image.price}`);
  };

  const ImageCard = ({ image }: { image: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group"
    >
      {/* Image Container with Watermark */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Placeholder for image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">✈️</div>
              <div className="text-sm text-gray-600">Aviation Image</div>
              <div className="text-xs text-gray-500 mt-1">
                {image.resolution} • {image.downloads} downloads
              </div>
            </div>
          </div>
        </div>

        {/* Watermark Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-4xl md:text-5xl font-bold text-white/10 select-none">
            PilotWardrobe
          </div>
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${image.price}
        </div>

        {/* Seller Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          <div className="flex items-center gap-1">
            <span className="text-blue-600">⭐</span>
            <span className="text-gray-900">{image.sellerRating}</span>
            <span className="text-gray-600 ml-1">{image.seller}</span>
          </div>
        </div>

        {/* Quick View Button */}
        <button
          onClick={() => setSelectedImage(image)}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
        >
          Quick View
        </button>
      </div>

      {/* Image Details */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-2">{image.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {image.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {image.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedImage(image)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => handlePurchase(image)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Purchase
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Breadcrumb
        title="Aviation Images & Flight Views"
        pages={["Home", "Shop", "Aviation Images"]}
      />

      <section className="py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="lg:w-2/3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">
                  <span>Digital Marketplace</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Aviation Images & Flight Views
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Premium aviation photography captured by pilots worldwide.
                  Purchase high-quality images for personal or commercial use.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Sell Your Images
                  </button>
                  <a
                    href="#how-it-works"
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                  >
                    How It Works
                  </a>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Earn from Your Flight Views</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Keep 70% of each sale</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Professional watermarking</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Global exposure to aviation enthusiasts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Sorting */}
          <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-4">Filter Images</h3>
                <div className="space-y-4">
                  {/* Price Range */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Price Range: ${priceRange[0]} - ${priceRange[1]}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-64">
                <div className="space-y-4">
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  {/* Reset Filters */}
                  <button
                    onClick={() => {
                      setPriceRange([10, 50]);
                      setSelectedTags([]);
                      setSortBy("popular");
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Images <span className="text-blue-600">({filteredImages.length})</span>
              </h2>
              <div className="text-sm text-gray-500">
                Prices range from ${priceRange[0]} to ${priceRange[1]}
              </div>
            </div>

            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image) => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No images found</h3>
                <p className="text-gray-600 mb-8">
                  Try adjusting your filters or be the first to upload images in this category!
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Upload First Image
                </button>
              </div>
            )}
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="py-12 border-t border-gray-200">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Your Images</h3>
                  <p className="text-gray-600">
                    Share your aviation photos taken from the cockpit. Minimum 4K resolution recommended.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Set Your Price</h3>
                  <p className="text-gray-600">
                    Price your images between $10-$35. You earn 70% of each sale.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Money</h3>
                  <p className="text-gray-600">
                    Get paid when customers purchase your images. Payments processed monthly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedImage.title}</h2>
                  <p className="text-gray-600">By {selectedImage.seller} • ⭐ {selectedImage.sellerRating}</p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Image Preview */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🛩️</div>
                    <div className="text-lg font-medium text-gray-700">{selectedImage.title}</div>
                    <div className="text-sm text-gray-500 mt-2">
                      {selectedImage.resolution} • Watermarked Preview
                    </div>
                    <div className="mt-6 text-3xl font-bold text-white/10 select-none">
                      PilotWardrobe
                    </div>
                  </div>
                </div>

                {/* Details & Purchase */}
                <div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedImage.description}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Resolution</div>
                          <div className="font-medium">{selectedImage.resolution}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Downloads</div>
                          <div className="font-medium">{selectedImage.downloads}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Upload Date</div>
                          <div className="font-medium">{selectedImage.uploadedDate}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Seller Rating</div>
                          <div className="font-medium">⭐ {selectedImage.sellerRating}/5</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedImage.tags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="text-3xl font-bold text-gray-900">${selectedImage.price}</div>
                          <div className="text-sm text-gray-500">One-time purchase • High-resolution download</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handlePurchase(selectedImage)}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                          Purchase Image
                        </button>
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Continue Browsing
                        </button>
                      </div>

                      <div className="mt-4 text-sm text-gray-500 text-center">
                        Includes commercial license • Watermark removed upon purchase
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload Your Aviation Image</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={uploading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleImageUpload}>
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Image</h3>
                    <p className="text-gray-600 mb-4">
                      Drag & drop or click to browse. Recommended: 4K resolution or higher.
                    </p>
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Choose File
                    </button>
                    <p className="text-sm text-gray-500 mt-3">
                      PNG, JPG, or WebP • Max 10MB • Watermark will be added automatically
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Image Title *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 'Sunset Over Alps'"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Describe the view, location, or special features..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Price ($) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          min="10"
                          max="35"
                          step="5"
                          value={uploadForm.price}
                          onChange={(e) => setUploadForm({ ...uploadForm, price: parseInt(e.target.value) || 10 })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Set price between $10-$35</p>
                    </div>

                    {/* Resolution */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Resolution *
                      </label>
                      <select
                        value={uploadForm.resolution}
                        onChange={(e) => setUploadForm({ ...uploadForm, resolution: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="4K">4K (3840x2160)</option>
                        <option value="5K">5K (5120x2880)</option>
                        <option value="6K">6K (6144x3456)</option>
                        <option value="8K">8K (7680x4320)</option>
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Tags (comma separated) *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., sunset, mountains, cockpit, alps"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Add relevant tags to help customers find your image
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I confirm that I own the rights to this image and agree to PilotWardrobe's terms.
                        I understand that images will be watermarked and I'll receive 70% of each sale.
                      </label>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        "Upload & List Image"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AviationImagesPage;