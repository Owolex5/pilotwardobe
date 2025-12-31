"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useDropzone } from "react-dropzone";

const SellYourGear = () => {
  const [step, setStep] = useState(1);

  const [item, setItem] = useState({
    title: "",
    itemType: "gear", // "gear" or "aircraft"
    category: "",
    condition: "",
    description: "",
    forSale: true,
    forSwap: false,
    price: "",
    swapDetails: "",
    images: [] as File[],
    videos: [] as File[],
  });

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSubscribed] = useState(false); // Mock — replace with real auth later

  // Categories expanded for drones & parts
  const categories = [
    "Headsets",
    "Uniforms",
    "Flight Bags",
    "Watches",
    "Kneeboards",
    "Sunglasses",
    "Logbooks",
    "Drones",
    "Avionics",
    "Engines & Props",
    "Airframe Parts",
    "Instruments",
    "Interior",
    "Other Aircraft Parts",
    "Other Gear",
  ];

  // Condition options change based on item type
  const gearConditions = ["Like New", "Excellent", "Good", "Fair"];
  const aircraftConditions = [
    "New",
    "Like New",
    "Good Working",
    "For Parts/Repair",
    "As-Is",
  ];

  const currentConditions =
    item.itemType === "aircraft" ? aircraftConditions : gearConditions;

  // Dropzones
  const {
    getRootProps: getImageProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDrag,
  } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: isSubscribed ? 20 : 6,
    onDrop: (files) =>
      setItem((prev) => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, isSubscribed ? 20 : 6),
      })),
  });

  const {
    getRootProps: getVideoProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDrag,
  } = useDropzone({
    accept: { "video/*": [] },
    maxFiles: isSubscribed ? 5 : 1,
    onDrop: (files) =>
      setItem((prev) => ({
        ...prev,
        videos: [...prev.videos, ...files].slice(0, isSubscribed ? 5 : 1),
      })),
  });

  const removeMedia = (type: "images" | "videos", index: number) => {
    setItem((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Listing submitted:", { item, contact });
    setStep(5);
  };

  return (
    <>
      <Breadcrumb title="Sell or Swap Your Gear" pages={["Home", "Sell Your Gear"]} />

      <section className="py-16 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          {/* Progress Bar */}
          <div className="mb-16">
            <div className="flex items-center justify-between relative">
              {["Item Details", "Sale/Swap", "Photos & Media", "Contact", "Submit"].map((label, i) => (
                <div key={i} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all shadow-lg ${
                      step > i + 1
                        ? "bg-green-600 text-white"
                        : step === i + 1
                        ? "bg-blue text-white scale-110"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className="mt-3 text-sm font-medium text-dark-4 hidden sm:block">
                    {label}
                  </span>
                </div>
              ))}
              <div className="absolute top-7 left-14 right-14 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-blue transition-all duration-500"
                  style={{ width: step >= 5 ? "100%" : `${((step - 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Step 1: Item Details */}
            {step === 1 && (
              <div className="p-8 lg:p-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-10">
                  List Your Aviation Gear or Aircraft Parts
                </h2>

                {!isSubscribed && (
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 mb-10">
                    <h3 className="font-bold text-xl mb-4">Free Account Limits</h3>
                    <ul className="space-y-2 text-dark-4">
                      <li>• Up to 6 active listings</li>
                      <li>• Max 6 photos per item</li>
                      <li>• 1 video per item</li>
                    </ul>
                    <p className="mt-4">
                      <a href="/pricing" className="text-blue font-bold hover:underline">
                        Upgrade for unlimited listings, more media, and featured spots
                      </a>
                    </p>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Item Type Selector */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Pilot Gear Option */}
  <button
    type="button"
    onClick={() => setItem({ ...item, itemType: "gear", condition: "excellent" })}
    className={`p-8 rounded-2xl border-4 transition-all text-left group ${
      item.itemType === "gear"
        ? "border-blue bg-blue/5 shadow-lg"
        : "border-gray-200 hover:border-gray-400"
    }`}
  >
    <div className={`mb-4 transition-colors ${item.itemType === "gear" ? "text-blue" : "text-gray-400 group-hover:text-gray-600"}`}>
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 1v12m0 0a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm-7-2a2 2 0 012-2h10a2 2 0 012 2M5 11V7a7 7 0 1114 0v4" />
      </svg>
    </div>
    <h3 className="font-bold text-2xl mb-2">Pilot Gear</h3>
    <p className="text-dark-4">Headsets, uniforms, watches, bags, etc.</p>
  </button>

  {/* Aircraft Parts Option */}
  <button
    type="button"
    onClick={() => setItem({ ...item, itemType: "aircraft", condition: "good working" })}
    className={`p-8 rounded-2xl border-4 transition-all text-left group ${
      item.itemType === "aircraft"
        ? "border-blue bg-blue/5 shadow-lg"
        : "border-gray-200 hover:border-gray-400"
    }`}
  >
    <div className={`mb-4 transition-colors ${item.itemType === "aircraft" ? "text-blue" : "text-gray-400 group-hover:text-gray-600"}`}>
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2.372a2 2 0 011.612.814l.828 1.184a2 2 0 001.612.814H19a2 2 0 002-2V8a2 2 0 00-2-2h-3.172a2 2 0 01-1.612-.814l-.828-1.184A2 2 0 0011.774 4H5.055a2 2 0 00-2 2v5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 12a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>
    <h3 className="font-bold text-2xl mb-2">Aircraft Parts & Drones</h3>
    <p className="text-dark-4">Avionics, engines, airframe, drones, instruments</p>
  </button>
</div>
              

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">Item Title *</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => setItem({ ...item, title: e.target.value })}
                      placeholder={item.itemType === "aircraft" ? "e.g., Garmin GNS 430W (For Parts)" : "e.g., Bose A30 Headset - Like New"}
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">Category *</label>
                    <select
                      value={item.category}
                      onChange={(e) => setItem({ ...item, category: e.target.value })}
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition bg-white"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">Condition *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {currentConditions.map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setItem({ ...item, condition: cond.toLowerCase() })}
                          className={`py-5 px-4 rounded-2xl font-medium text-lg border-2 transition shadow-md ${
                            item.condition === cond.toLowerCase()
                              ? "border-blue bg-blue text-white shadow-blue/30"
                              : "border-gray-300 hover:border-blue"
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                    {item.itemType === "aircraft" && (
                      <p className="text-sm text-dark-4 mt-4">
                        <strong>For Parts/Repair</strong>: Non-airworthy but usable components<br />
                        <strong>As-Is</strong>: Sold with no guarantees
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">Description *</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => setItem({ ...item, description: e.target.value })}
                      rows={8}
                      placeholder={
                        item.itemType === "aircraft"
                          ? "Include part number, serial, logs, damage history, airworthiness status..."
                          : "Detail condition, usage history, accessories included, any wear..."
                      }
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end mt-12">
                    <button
                      onClick={handleNext}
                      disabled={!item.title || !item.category || !item.condition || !item.description}
                      className="px-12 py-6 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-2xl disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Sale/Swap Options */}
            {step === 2 && (
              <div className="p-8 lg:p-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-10">
                  For Sale, Swap, or Both?
                </h2>

                <div className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <label className="flex items-center gap-6 p-8 rounded-3xl border-2 border-gray-300 hover:border-blue transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.forSale}
                        onChange={(e) => setItem({ ...item, forSale: e.target.checked })}
                        className="w-8 h-8 text-blue border-gray-300 rounded focus:ring-blue/30"
                      />
                      <div>
                        <h3 className="font-bold text-2xl mb-2">For Sale</h3>
                        <p className="text-dark-4 text-lg">List with a fixed price</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-6 p-8 rounded-3xl border-2 border-gray-300 hover:border-blue transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.forSwap}
                        onChange={(e) => setItem({ ...item, forSwap: e.target.checked })}
                        className="w-8 h-8 text-blue border-gray-300 rounded focus:ring-blue/30"
                      />
                      <div>
                        <h3 className="font-bold text-2xl mb-2">Open to Swap</h3>
                        <p className="text-dark-4 text-lg">Trade for other gear or parts</p>
                      </div>
                    </label>
                  </div>

                  {item.forSale && (
                    <div>
                      <label className="block text-lg font-semibold text-dark mb-4">
                        Asking Price (USD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-dark-4">$</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => setItem({ ...item, price: e.target.value })}
                          placeholder="450"
                          min="0"
                          className="w-full pl-12 pr-6 py-6 text-2xl border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                          required={item.forSale}
                        />
                      </div>
                      <p className="text-sm text-dark-4 mt-3">Or Best Offer accepted</p>
                    </div>
                  )}

                  {item.forSwap && (
                    <div>
                      <label className="block text-lg font-semibold text-dark mb-4">
                        What would you like in exchange? (optional)
                      </label>
                      <textarea
                        value={item.swapDetails}
                        onChange={(e) => setItem({ ...item, swapDetails: e.target.value })}
                        rows={5}
                        placeholder="e.g., Looking for a Garmin GTN 650, Bose A30, or similar value drone parts"
                        className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition resize-none"
                      />
                    </div>
                  )}

                  <div className="flex justify-between mt-16">
                    <button
                      onClick={handleBack}
                      className="px-10 py-5 text-xl font-medium border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={(!item.forSale && !item.forSwap) || (item.forSale && !item.price)}
                      className="px-14 py-6 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-2xl disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Photos & Media */}
            {step === 3 && (
              <div className="p-8 lg:p-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-10">
                  Show Off Your Item
                </h2>

                <div className="space-y-16">
                  {/* Photos */}
                  <div>
                    <label className="block text-lg font-semibold text-dark mb-4">
                      Photos (up to {isSubscribed ? 20 : 6}) *
                    </label>
                    <div
                      {...getImageProps()}
                      className={`border-4 border-dashed rounded-3xl p-16 text-center cursor-pointer transition ${
                        isImageDrag ? "border-blue bg-blue-50" : "border-gray-300 hover:border-blue"
                      }`}
                    >
                      <input {...getImageInputProps()} />
                      <svg className="w-20 h-20 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <p className="text-2xl font-medium text-dark mb-2">
                        {isImageDrag ? "Drop here" : "Drag photos or click to browse"}
                      </p>
                      <p className="text-dark-4 text-lg">
                        {item.itemType === "aircraft"
                          ? "Show part number, serial tags, damage, logs"
                          : "Multiple angles, close-ups of condition"}
                      </p>
                    </div>

                    {item.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
                        {item.images.map((file, i) => (
                          <div key={i} className="relative rounded-3xl overflow-hidden shadow-2xl group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Photo ${i + 1}`}
                              className="w-full aspect-square object-cover"
                            />
                            <button
                              onClick={() => removeMedia("images", i)}
                              className="absolute top-4 right-4 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-3xl"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Videos */}
                  <div>
                    <label className="block text-lg font-semibold text-dark mb-4">
                      Videos (up to {isSubscribed ? 5 : 1}, optional)
                    </label>
                    <div
                      {...getVideoProps()}
                      className={`border-4 border-dashed rounded-3xl p-16 text-center cursor-pointer transition ${
                        isVideoDrag ? "border-blue bg-blue-50" : "border-gray-300 hover:border-blue"
                      }`}
                    >
                      <input {...getVideoInputProps()} />
                      <svg className="w-20 h-20 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-2xl font-medium text-dark mb-2">
                        {isVideoDrag ? "Drop videos" : "Drag videos or click"}
                      </p>
                      <p className="text-dark-4 text-lg">Max 30 seconds — show function or condition</p>
                    </div>

                    {item.videos.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {item.videos.map((file, i) => (
                          <div key={i} className="relative rounded-3xl overflow-hidden shadow-2xl group bg-gray-900">
                            <video
                              src={URL.createObjectURL(file)}
                              controls
                              muted
                              className="w-full aspect-video object-cover"
                            />
                            <button
                              onClick={() => removeMedia("videos", i)}
                              className="absolute top-4 right-4 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-3xl"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isSubscribed && (
                    <div className="bg-amber-50 border border-amber-400 rounded-3xl p-8 text-center">
                      <p className="text-xl font-medium mb-6">Want more photos & videos?</p>
                      <a href="/pricing" className="text-blue hover:underline text-xl font-bold">
                        Upgrade to Premium — unlimited media & priority listings
                      </a>
                    </div>
                  )}

                  <div className="flex justify-between mt-16">
                    <button
                      onClick={handleBack}
                      className="px-10 py-5 text-xl font-medium border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={item.images.length === 0}
                      className="px-14 py-6 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-2xl disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact */}
            {step === 4 && (
              <div className="p-8 lg:p-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-10">
                  Your Contact Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
                  <div>
                    <label className="block text-lg font-semibold text-dark mb-4">Full Name *</label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      required
                      placeholder="Captain Sarah Connor"
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-4">Email Address *</label>
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      required
                      placeholder="sarah@example.com"
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-4">Phone Number (optional)</label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                    />
                  </div>

                  <div className="bg-blue-50 border-2 border-blue/30 rounded-3xl p-8">
                    <h3 className="font-bold text-2xl mb-6 text-blue">Listing Guidelines</h3>
                    <ul className="space-y-4 text-dark text-lg">
                      <li className="flex items-start gap-4">
                        <span className="text-green-600 text-3xl">✓</span>
                        <span>All listings are manually reviewed within 24 hours</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-green-600 text-3xl">✓</span>
                        <span>Aircraft parts must include condition & airworthiness info</span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-green-600 text-3xl">✓</span>
                        <span>No counterfeit or illegal items</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-between mt-16">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-12 py-6 text-xl font-medium border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="px-16 py-6 bg-green-600 text-white font-bold text-2xl rounded-2xl hover:bg-green-700 transition shadow-2xl"
                    >
                      Submit Listing
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <div className="text-center py-32 px-8">
                <div className="w-48 h-48 mx-auto mb-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-32 h-32 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-dark mb-8">
                  Listing Submitted Successfully!
                </h1>
                <p className="text-2xl text-dark-4 mb-6">
                  Thank you, <span className="font-bold text-blue">{contact.name || "Pilot"}</span>!
                </p>
                <p className="text-xl text-dark-4 max-w-4xl mx-auto mb-16 leading-relaxed">
                  Your item has been received and is under review. We'll email you within 24 hours when it's live
                  {item.itemType === "aircraft" && " or if we need airworthiness documentation"}.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  <a
                    href="/marketplace"
                    className="px-16 py-7 bg-blue text-white font-bold text-2xl rounded-3xl hover:bg-blue-dark transition shadow-2xl"
                  >
                    Browse Marketplace →
                  </a>
                  <a
                    href="/sell"
                    className="px-16 py-7 border-4 border-blue text-blue font-bold text-2xl rounded-3xl hover:bg-blue hover:text-white transition"
                  >
                    List Another Item
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SellYourGear;