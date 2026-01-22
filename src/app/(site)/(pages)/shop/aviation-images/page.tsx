// app/shop/aviation-images/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, X, ChevronRight, Upload, Download, 
  Star, Eye, Camera, TrendingUp, CheckCircle, 
  Grid, List, ZoomIn, DollarSign, Calendar, 
  User, Clock, Heart, Share2, Tag, Settings
} from "lucide-react";

// Mock data for aviation images
const initialImages = [
  {
    id: 1,
    title: "Sunset Over Swiss Alps",
    description: "Breathtaking sunset view from cockpit over the Swiss Alps, golden hour lighting",
    price: 35,
    seller: "Captain John D.",
    sellerRating: 4.9,
    imageUrl: "/images/aviation/sunset-mountains.jpg",
    tags: ["sunset", "mountains", "alps", "golden-hour", "cockpit-view"],
    resolution: "6K",
    downloads: 142,
    uploadedDate: "2024-01-15",
    views: 1250,
    likes: 89,
    license: "Personal & Commercial",
    aspectRatio: "16:9"
  },
  {
    id: 2,
    title: "Aurora Borealis Flight - Iceland",
    description: "Spectacular Northern Lights view from flight deck over Reykjavik",
    price: 45,
    seller: "First Officer Sarah L.",
    sellerRating: 4.8,
    imageUrl: "/images/aviation/aurora-flight.jpg",
    tags: ["aurora", "night", "arctic", "northern-lights", "winter"],
    resolution: "8K",
    downloads: 89,
    uploadedDate: "2024-01-10",
    views: 980,
    likes: 67,
    license: "Personal & Commercial",
    aspectRatio: "21:9"
  },
  {
    id: 3,
    title: "Cloud Ocean Sunrise",
    description: "Early morning clouds with golden sunrise over Atlantic Ocean",
    price: 28,
    seller: "PilotWardrobe Pro",
    sellerRating: 5.0,
    imageUrl: "/images/aviation/cloud-sunrise.jpg",
    tags: ["sunrise", "clouds", "morning", "ocean", "golden-hour"],
    resolution: "5K",
    downloads: 210,
    uploadedDate: "2024-01-05",
    views: 1560,
    likes: 124,
    license: "Personal & Commercial",
    aspectRatio: "16:9"
  },
  {
    id: 4,
    title: "Storm Front Below",
    description: "Dramatic storm clouds viewed from above the weather system",
    price: 38,
    seller: "Captain Mike R.",
    sellerRating: 4.7,
    imageUrl: "/images/aviation/storm-clouds.jpg",
    tags: ["storm", "dramatic", "weather", "clouds", "lightning"],
    resolution: "6K",
    downloads: 67,
    uploadedDate: "2024-01-18",
    views: 780,
    likes: 45,
    license: "Personal & Commercial",
    aspectRatio: "16:9"
  },
  {
    id: 5,
    title: "Alpine Lake Approach - Swiss",
    description: "Approaching landing with crystal clear alpine lakes in view",
    price: 32,
    seller: "First Officer Emma K.",
    sellerRating: 4.9,
    imageUrl: "/images/aviation/alpine-lakes.jpg",
    tags: ["mountains", "lakes", "approach", "switzerland", "alps"],
    resolution: "5K",
    downloads: 124,
    uploadedDate: "2024-01-12",
    views: 1020,
    likes: 78,
    license: "Personal & Commercial",
    aspectRatio: "4:3"
  },
  {
    id: 6,
    title: "Night City Lights - Tokyo",
    description: "Tokyo city lights at night from cruising altitude",
    price: 42,
    seller: "PilotWardrobe Elite",
    sellerRating: 5.0,
    imageUrl: "/images/aviation/night-city.jpg",
    tags: ["night", "city", "lights", "tokyo", "urban"],
    resolution: "8K",
    downloads: 178,
    uploadedDate: "2024-01-08",
    views: 1340,
    likes: 112,
    license: "Personal & Commercial",
    aspectRatio: "21:9"
  },
  {
    id: 7,
    title: "Desert Sunset - Dubai",
    description: "Sunset over Dubai desert during approach to DXB",
    price: 31,
    seller: "Captain Ahmed S.",
    sellerRating: 4.8,
    imageUrl: "/images/aviation/desert-sunset.jpg",
    tags: ["desert", "dubai", "sunset", "sand", "middle-east"],
    resolution: "5K",
    downloads: 95,
    uploadedDate: "2024-01-20",
    views: 890,
    likes: 56,
    license: "Personal & Commercial",
    aspectRatio: "16:9"
  },
  {
    id: 8,
    title: "Fjords of Norway",
    description: "Aerial view of Norwegian fjords during summer",
    price: 39,
    seller: "First Officer Lena B.",
    sellerRating: 4.9,
    imageUrl: "/images/aviation/fjords.jpg",
    tags: ["fjords", "norway", "summer", "water", "mountains"],
    resolution: "6K",
    downloads: 110,
    uploadedDate: "2024-01-14",
    views: 950,
    likes: 72,
    license: "Personal & Commercial",
    aspectRatio: "4:3"
  },
  {
    id: 9,
    title: "Pacific Ocean Clouds",
    description: "Endless cloud formations over the Pacific Ocean",
    price: 26,
    seller: "Captain James W.",
    sellerRating: 4.6,
    imageUrl: "/images/aviation/pacific-clouds.jpg",
    tags: ["ocean", "clouds", "pacific", "patterns", "flight"],
    resolution: "4K",
    downloads: 84,
    uploadedDate: "2024-01-22",
    views: 720,
    likes: 41,
    license: "Personal & Commercial",
    aspectRatio: "16:9"
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
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    price: 25,
    tags: "",
    resolution: "4K",
    licenseType: "personal-commercial",
  });
  const [previewMode, setPreviewMode] = useState<"preview" | "details">("preview");

  // Extract all unique tags
  const allTags = Array.from(
    new Set(images.flatMap((img) => img.tags))
  );

  // Filter images based on selections
  useEffect(() => {
    let filtered = [...images];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (img) =>
          img.title.toLowerCase().includes(query) ||
          img.description.toLowerCase().includes(query) ||
          img.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          img.seller.toLowerCase().includes(query)
      );
    }

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
  }, [images, priceRange, selectedTags, sortBy, searchQuery]);

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
      imageUrl: "/images/aviation/placeholder.jpg",
      tags: uploadForm.tags.split(",").map((tag) => tag.trim()),
      downloads: 0,
      views: 0,
      likes: 0,
      uploadedDate: new Date().toISOString().split("T")[0],
      aspectRatio: "16:9",
      license: uploadForm.licenseType === "personal-commercial" ? "Personal & Commercial" : "Personal Only"
    };

    setImages([newImage, ...images]);
    setUploadForm({
      title: "",
      description: "",
      price: 25,
      tags: "",
      resolution: "4K",
      licenseType: "personal-commercial",
    });
    setShowUploadModal(false);
    setUploading(false);
  };

  const handlePurchase = async (image: any) => {
    alert(`Proceeding to purchase: ${image.title} for $${image.price}\n\nPayment integration will be implemented with Flutterwave.`);
  };

  const ImageCard = ({ image }: { image: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 group relative ${
        viewMode === "list" ? "flex" : ""
      }`}
    >
      {/* Image Container with Watermark */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 ${
        viewMode === "list" ? "w-64" : "h-64"
      }`}>
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30" />
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '300px 300px'
          }} />
        </div>

        {/* Image Preview */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-5xl mb-4 animate-pulse">🛫</div>
              <div className="text-white text-lg font-medium mb-2">{image.title}</div>
              <div className="text-blue-200 text-sm">
                {image.resolution} • {image.downloads} downloads
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Watermark Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-5xl md:text-6xl font-bold text-white/5 select-none tracking-wider transform rotate-[-3deg]">
            PILOT<span className="text-blue-300/10">WARDROBE</span>
          </div>
        </div>

        {/* Price Tag */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/30"
        >
          ${image.price}
        </motion.div>

        {/* Seller Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-gray-900">{image.sellerRating}</span>
              </div>
              <div className="text-xs text-gray-600 truncate max-w-[100px]">{image.seller}</div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white/90">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span className="text-xs">{image.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span className="text-xs">{image.downloads}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span className="text-xs">{image.likes}</span>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-white/20 rounded">{image.resolution}</span>
          </div>
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedImage(image)}
              className="px-4 py-2 bg-white/90 text-gray-900 rounded-lg hover:bg-white transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <ZoomIn className="w-4 h-4" />
              <span className="font-medium">Preview</span>
            </button>
            <button
              onClick={() => handlePurchase(image)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-blue rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Details */}
      <div className={`p-5 ${viewMode === "list" ? "flex-1" : ""}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
              {image.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {image.description}
            </p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {image.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs rounded-full border border-blue-100"
            >
              #{tag}
            </span>
          ))}
          {image.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{image.tags.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Stats */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {image.uploadedDate}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-gray-900">
              <span className="text-green-600">${image.price}</span>
            </div>
            <button
              onClick={() => setSelectedImage(image)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Details
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Breadcrumb
        title="Premium Aviation Images"
        pages={["Home", "Shop", "Aviation Images"]}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
              <div className="lg:w-2/3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 uppercase tracking-wider mb-6 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  Premium Digital Marketplace
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text">
                    Aviation Images
                  </span>
                  <br />
                  & Flight Views
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-3xl">
                  Exclusive aviation photography captured by professional pilots worldwide.
                  Premium quality images for personal, commercial, and editorial use.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setShowUploadModal(true)}
                  
                   
               className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm flex items-center gap-3">
                    <Camera className="w-5 h-5" />
                    <span>Sell Your Images</span>
                  </button>
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">1.2K+</div>
                    <div className="text-sm text-gray-600">Premium Images</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">4.8⭐</div>
                    <div className="text-sm text-gray-600">Avg. Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">$85K+</div>
                    <div className="text-sm text-gray-600">Earned by Pilots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-200 shadow-2xl shadow-blue-100/50"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                      <Camera className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Earn 70% Royalties</h3>
                      <p className="text-blue-600 font-semibold">Per Sale</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Professional watermarking & protection",
                      "Global exposure to aviation enthusiasts",
                      "Automated payment processing",
                      "Dedicated seller dashboard",
                      "24/7 customer support"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center text-sm text-gray-500">
                      Join <span className="font-bold text-blue-600">450+</span> pilots earning from their flight views
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Search & Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search images, tags, or sellers..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
                  />
                  <button 
                    onClick={() => setSearchQuery("")}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-opacity ${searchQuery ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-xl transition-all ${viewMode === "list" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {selectedTags.length > 0 && (
                    <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {selectedTags.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Filter Images</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Price Range */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                          <span>Price Range</span>
                          <span className="font-bold text-blue-600">${priceRange[0]} - ${priceRange[1]}</span>
                        </div>
                        <div className="space-y-6">
                          <div className="relative">
                            <input
                              type="range"
                              min="10"
                              max="50"
                              step="5"
                              value={priceRange[0]}
                              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                              className="w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-lg"
                            />
                            <input
                              type="range"
                              min="10"
                              max="50"
                              step="5"
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                              className="w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-500 [&::-webkit-slider-thumb]:shadow-lg"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>$10</span>
                            <span>$50+</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {allTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleTagToggle(tag)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                                selectedTags.includes(tag)
                                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Sort By
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="popular">Most Popular</option>
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => {
                              setPriceRange([10, 50]);
                              setSelectedTags([]);
                              setSortBy("popular");
                            }}
                            className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Premium Collection <span className="text-blue-600">({filteredImages.length})</span>
              </h2>
              <p className="text-gray-600 mt-2">
                {filteredImages.length === images.length 
                  ? "Showing all premium aviation images" 
                  : `${filteredImages.length} images match your filters`}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold text-blue-600">${priceRange[0]}-${priceRange[1]}</span> price range
            </div>
          </div>

          {/* Image Grid/List */}
          <AnimatePresence mode="wait">
            {filteredImages.length > 0 ? (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
                }
              >
                {filteredImages.map((image) => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Camera className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">No images found</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Try adjusting your filters or be the pioneer to upload aviation images in this category!
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
                >
                  Upload Your First Masterpiece
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Featured Stats */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 text-slate">
            <div className="grid md:grid-cols-3 gap-8 text-center text-slate">
              <div>
                <div className="text-5xl font-bold mb-2">70%</div>
                <div className="text-xl">Royalty Rate</div>
                <div className="text-blue-100 mt-2">Cool Indutry Review</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">24h</div>
                <div className="text-xl">Review Process</div>
                <div className="text-blue-100 mt-2">Quick approval time</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">$2.5K</div>
                <div className="text-xl">Avg. Monthly Earnings</div>
                <div className="text-blue-100 mt-2">Top performing sellers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedImage.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{selectedImage.seller}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-gray-300">{selectedImage.sellerRating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPreviewMode(previewMode === "preview" ? "details" : "preview")}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {previewMode === "preview" ? "Details" : "Preview"}
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)]">
                {/* Image Preview Section */}
                <div className={`lg:w-${previewMode === "preview" ? "2/3" : "1/2"} p-6 ${previewMode === "details" ? 'border-r border-gray-700/50' : ''}`}>
                  <div className="relative h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    {/* Main Image Display */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-8xl mb-6 animate-float">✈️</div>
                          <div className="text-white text-2xl font-medium mb-4">{selectedImage.title}</div>
                          <div className="text-blue-300 text-lg">
                            {selectedImage.resolution} • Watermarked Preview
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-7xl md:text-8xl font-bold text-white/5 select-none tracking-wider transform rotate-[-5deg] animate-pulse-slow">
                        PILOT<span className="text-cyan-300/10">WARDROBE</span>
                      </div>
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-gradient-to-r from-black/60 to-transparent backdrop-blur-sm rounded-xl p-4">
                        <div className="flex justify-between items-center text-white">
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{selectedImage.views}</div>
                              <div className="text-xs text-gray-400">Views</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold">{selectedImage.downloads}</div>
                              <div className="text-xs text-gray-400">Downloads</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold">{selectedImage.likes}</div>
                              <div className="text-xs text-gray-400">Likes</div>
                            </div>
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                            ${selectedImage.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details & Purchase Section */}
                <div className={`lg:w-${previewMode === "preview" ? "1/3" : "1/2"} p-6 overflow-y-auto`}>
                  {previewMode === "preview" ? (
                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                        <p className="text-gray-300">{selectedImage.description}</p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <div className="text-sm text-gray-400">Resolution</div>
                          <div className="text-white font-semibold">{selectedImage.resolution}</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <div className="text-sm text-gray-400">Aspect Ratio</div>
                          <div className="text-white font-semibold">{selectedImage.aspectRatio}</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <div className="text-sm text-gray-400">License</div>
                          <div className="text-white font-semibold">{selectedImage.license}</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <div className="text-sm text-gray-400">Uploaded</div>
                          <div className="text-white font-semibold">{selectedImage.uploadedDate}</div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedImage.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 text-blue-300 rounded-full text-sm border border-blue-800/50"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Purchase Section */}
                      <div className="pt-6 border-t border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <div className="text-4xl font-bold text-white">${selectedImage.price}</div>
                            <div className="text-sm text-gray-400">One-time purchase • Full resolution • No watermark</div>
                          </div>
                          <div className="text-sm text-gray-300">
                            <span className="text-green-400">70%</span> goes to photographer
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={() => handlePurchase(selectedImage)}
                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3"
                          >
                            <DollarSign className="w-5 h-5" />
                            <span>Purchase Image</span>
                            <div className="ml-auto px-3 py-1 bg-white/20 rounded-full text-sm">
                              ${selectedImage.price}
                            </div>
                          </button>
                          <button
                            onClick={() => setSelectedImage(null)}
                            className="w-full px-6 py-4 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-colors"
                          >
                            Continue Browsing
                          </button>
                        </div>

                        <div className="mt-6 text-center">
                          <div className="text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 inline mr-2 text-green-500" />
                            Includes commercial license • Watermark removed upon purchase
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Technical Details */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Technical Specifications</h3>
                        <div className="space-y-3">
                          {[
                            { label: "File Format", value: "JPG/PNG" },
                            { label: "Color Profile", value: "sRGB" },
                            { label: "Bit Depth", value: "24-bit" },
                            { label: "DPI", value: "300" },
                            { label: "File Size", value: "15-25 MB" },
                          ].map((spec, index) => (
                            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700/30">
                              <span className="text-gray-400">{spec.label}</span>
                              <span className="text-white font-medium">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* License Details */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">License Details</h3>
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <div className="space-y-3">
                            {[
                              "Commercial use allowed",
                              "No attribution required",
                              "Unlimited digital copies",
                              "Print rights included",
                              "No resale as stock",
                            ].map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-gray-300">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Seller Info */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">About the Photographer</h3>
                        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">{selectedImage.seller}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="text-gray-300">{selectedImage.sellerRating} rating</span>
                            </div>
                            <div className="text-gray-400 text-sm mt-2">
                              {selectedImage.downloads} images sold on PilotWardrobe
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Upload Your Masterpiece</h2>
                    <p className="text-gray-600 mt-2">Share your aviation photography with the world</p>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    disabled={uploading}
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleImageUpload}>
                  <div className="space-y-8">
                    {/* Image Upload Zone */}
                    <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                        <Upload className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Drag & Drop Your Image</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Upload high-quality aviation photography. Minimum 4K resolution recommended for best sales.
                      </p>
                      <button
                        type="button"
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-blue font-bold rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                      >
                        Browse Files
                      </button>
                      <p className="text-sm text-gray-500 mt-6">
                        PNG, JPG, WebP up to 50MB • Professional watermark will be added automatically
                      </p>
                    </div>

                    {/* Form Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Image Title *
                        </label>
                        <input
                          type="text"
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                          placeholder="e.g., 'Golden Sunset Over Swiss Alps'"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Captivating Description *
                        </label>
                        <textarea
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                          rows={3}
                          placeholder="Tell the story behind this image... What makes it special?"
                          required
                        />
                      </div>

                      {/* Price & Resolution */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Set Your Price *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500">$</span>
                          <input
                            type="number"
                            min="10"
                            max="50"
                            value={uploadForm.price}
                            onChange={(e) => setUploadForm({ ...uploadForm, price: parseInt(e.target.value) || 10 })}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                            required
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>You earn: <span className="font-bold text-green-600">${(uploadForm.price * 0.7).toFixed(2)}</span></span>
                          <span>Platform fee: <span className="font-bold">${(uploadForm.price * 0.3).toFixed(2)}</span></span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Resolution *
                        </label>
                        <select
                          value={uploadForm.resolution}
                          onChange={(e) => setUploadForm({ ...uploadForm, resolution: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white"
                        >
                          <option value="4K">4K Ultra HD (3840x2160)</option>
                          <option value="5K">5K (5120x2880)</option>
                          <option value="6K">6K (6144x3456)</option>
                          <option value="8K">8K (7680x4320)</option>
                        </select>
                      </div>

                      {/* License Type */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          License Type *
                        </label>
                        <select
                          value={uploadForm.licenseType}
                          onChange={(e) => setUploadForm({ ...uploadForm, licenseType: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white"
                        >
                          <option value="personal-commercial">Personal & Commercial Use</option>
                          <option value="personal-only">Personal Use Only</option>
                        </select>
                      </div>

                      {/* Tags */}
                      <div className="md:col-span-2">
                        <label className="block text-lg font-semibold text-gray-900 mb-3">
                          Keywords & Tags *
                        </label>
                        <input
                          type="text"
                          value={uploadForm.tags}
                          onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                          placeholder="sunset, mountains, cockpit-view, alps, aviation, golden-hour"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Separate with commas • 5-10 relevant tags recommended for better discovery
                        </p>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mt-1 w-5 h-5"
                          required
                        />
                        <label htmlFor="terms" className="text-gray-700">
                          I confirm that I own full rights to this image and grant PilotWardrobe 
                          permission to display it with our watermark. I understand I'll receive 
                          70% royalty from each sale and that images are protected by our 
                          anti-piracy system.
                        </label>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                        disabled={uploading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-green-500/30 flex items-center justify-center gap-3"
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                            Uploading & Processing...
                          </>
                        ) : (
                          <>
<span className="text-blue flex items-center gap-2 font-medium">
  <Upload className="w-5 h-5 text-blue" />
  Upload & List for Sale
  <div className="ml-2 px-3 py-1 bg-slate-200/20 rounded-full text-sm text-blue/90">
    70% Royalty
  </div>
</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add CSS for custom animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          background: white;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          background: white;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
      `}</style>
    </>
  );
};

export default AviationImagesPage;