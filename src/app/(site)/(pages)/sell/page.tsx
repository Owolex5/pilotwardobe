"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useDropzone } from "react-dropzone";

const SellYourGear = () => {
  const [step, setStep] = useState(1); // 1: Item Details, 2: Sale/Swap, 3: Photos/Media, 4: Contact, 5: Success

  const [item, setItem] = useState({
    title: "",
    category: "",
    condition: "excellent",
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

  const [isSubscribed, setIsSubscribed] = useState(false); // Mock subscription status

  const categories = [
    "Headsets",
    "Uniforms",
    "Flight Bags",
    "Watches",
    "Kneeboards",
    "Sunglasses",
    "Logbooks",
    "Aircraft Parts",
    "Other",
  ];

  const conditions = ["Like New", "Excellent", "Good", "Fair"];

  // Image Dropzone
  const {
    getRootProps: getImageProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDrag,
  } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: isSubscribed ? 10 : 3,
    onDrop: (files) =>
      setItem((prev) => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, isSubscribed ? 10 : 3),
      })),
  });

  // Video Dropzone
  const {
    getRootProps: getVideoProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDrag,
  } = useDropzone({
    accept: { "video/*": [] },
    maxFiles: isSubscribed ? 3 : 0,
    onDrop: (files) =>
      setItem((prev) => ({
        ...prev,
        videos: [...prev.videos, ...files].slice(0, isSubscribed ? 3 : 0),
      })),
  });

  const removeMedia = (type: "images" | "videos", index: number) => {
    setItem((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Listing:", { item, contact });
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
                  List Your Aviation Gear for Sale or Swap
                </h2>

                {!isSubscribed && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-6 mb-10">
                    <h3 className="font-bold text-xl mb-4">Free Account Limits</h3>
                    <ul className="space-y-2 text-dark-4">
                      <li>• Up to 4 active listings</li>
                      <li>• Max 3 photos per item</li>
                      <li>• No videos</li>
                    </ul>
                    <p className="mt-4">
                      <a href="/subscribe" className="text-blue font-bold hover:underline">
                        Upgrade to Premium for unlimited listings, videos, and priority visibility ($10/quarter)
                      </a>
                    </p>
                  </div>
                )}

                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">Gear Title *</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => setItem({ ...item, title: e.target.value })}
                      placeholder="e.g., Bose A20 Aviation Headset"
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {conditions.map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setItem({ ...item, condition: cond.toLowerCase() })}
                          className={`py-5 rounded-2xl font-medium text-lg border-2 transition shadow-md ${
                            item.condition === cond.toLowerCase()
                              ? "border-blue bg-blue text-white shadow-blue/30"
                              : "border-gray-300 hover:border-blue"
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">Description *</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => setItem({ ...item, description: e.target.value })}
                      rows={6}
                      placeholder="Detail the item's features, usage history, any wear, accessories included..."
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end mt-12">
                    <button
                      onClick={handleNext}
                      disabled={!item.title || !item.category || !item.description}
                      className="px-10 py-5 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-2xl disabled:opacity-50"
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
                  For Sale or Swap?
                </h2>

                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <label className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-300 hover:border-blue transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.forSale}
                        onChange={(e) => setItem({ ...item, forSale: e.target.checked })}
                        className="w-6 h-6 text-blue border-gray-300 rounded focus:ring-blue/30"
                      />
                      <div>
                        <h3 className="font-bold text-xl">For Sale</h3>
                        <p className="text-dark-4">List for cash buyers</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-300 hover:border-blue transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.forSwap}
                        onChange={(e) => setItem({ ...item, forSwap: e.target.checked })}
                        className="w-6 h-6 text-blue border-gray-300 rounded focus:ring-blue/30"
                      />
                      <div>
                        <h3 className="font-bold text-xl">For Swap</h3>
                        <p className="text-dark-4">Open to trades</p>
                      </div>
                    </label>
                  </div>

                  {item.forSale && (
                    <div>
                      <label className="block text-lg font-semibold text-dark mb-3">
                        Asking Price (USD) *
                      </label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => setItem({ ...item, price: e.target.value })}
                        placeholder="e.g., 450"
                        min="0"
                        className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                        required={item.forSale}
                      />
                    </div>
                  )}

                  {item.forSwap && (
                    <div>
                      <label className="block text-lg font-semibold text-dark mb-3">
                        Preferred Swap Items (optional)
                      </label>
                      <textarea
                        value={item.swapDetails}
                        onChange={(e) => setItem({ ...item, swapDetails: e.target.value })}
                        rows={4}
                        placeholder="e.g., Looking for a similar headset in black or a flight bag"
                        className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition resize-none"
                      />
                    </div>
                  )}

                  <div className="flex justify-between mt-12">
                    <button
                      onClick={handleBack}
                      className="px-8 py-4 text-lg font-medium border border-gray-300 rounded-2xl hover:bg-gray-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={(!item.forSale && !item.forSwap) || (item.forSale && !item.price)}
                      className="px-10 py-5 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-2xl disabled:opacity-50"
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
                  Add Photos & Videos
                </h2>

                <div className="space-y-12">
                  {/* Photos */}
                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Photos (up to {isSubscribed ? 10 : 3}) *
                    </label>
                    <div
                      {...getImageProps()}
                      className={`border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                        isImageDrag ? "border-blue bg-blue-50" : "border-gray-300 hover:border-blue"
                      }`}
                    >
                      <input {...getImageInputProps()} />
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <p className="text-xl font-medium text-dark">
                        {isImageDrag ? "Drop photos here" : "Drag photos or click to upload"}
                      </p>
                      <p className="text-dark-4 mt-2">Show all angles, close-ups of wear</p>
                    </div>

                    {item.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                        {item.images.map((file, i) => (
                          <div key={i} className="relative rounded-2xl overflow-hidden shadow-lg group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Photo ${i + 1}`}
                              className="w-full aspect-square object-cover"
                            />
                            <button
                              onClick={() => removeMedia("images", i)}
                              className="absolute top-3 right-3 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Videos (Premium Only) */}
                  {isSubscribed && (
                    <div>
                      <label className="block text-lg font-semibold text-dark mb-3">
                        Videos (up to 3, optional)
                      </label>
                      <div
                        {...getVideoProps()}
                        className={`border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                          isVideoDrag ? "border-blue bg-blue-50" : "border-gray-300 hover:border-blue"
                        }`}
                      >
                        <input {...getVideoInputProps()} />
                        <svg
                          className="w-16 h-16 mx-auto mb-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xl font-medium text-dark">
                          {isVideoDrag ? "Drop videos here" : "Drag & drop videos or click to upload"}
                        </p>
                        <p className="text-dark-4 mt-2">Demo functionality or show condition (max 30s each)</p>
                      </div>

                      {item.videos.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                          {item.videos.map((file, i) => (
                            <div key={i} className="relative rounded-2xl overflow-hidden shadow-lg group bg-gray-100 flex items-center justify-center">
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-full aspect-square object-cover"
                                controls
                                muted
                              />
                              <button
                                onClick={() => removeMedia("videos", i)}
                                className="absolute top-3 right-3 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!isSubscribed && (
                    <div className="bg-yellow-50 border border-yellow-400 rounded-2xl p-6 text-center">
                      <p className="text-lg font-medium mb-4">Want videos or more photos?</p>
                      <a href="/subscribe" className="text-blue hover:underline font-bold">
                        Upgrade to Premium for $10/quarter
                      </a>
                    </div>
                  )}

                  <div className="flex justify-between mt-12">
                    <button
                      onClick={handleBack}
                      className="px-8 py-4 text-lg font-medium border border-gray-300 rounded-2xl hover:bg-gray-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={item.images.length === 0}
                      className="px-10 py-5 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-2xl disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact & Submit */}
            {step === 4 && (
              <div className="p-8 lg:p-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-10">
                  Your Contact Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-lg font-semibold text-dark mb-3">Full Name *</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        required
                        className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-dark mb-3">Email Address *</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        required
                        placeholder="you@pilot.com"
                        className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">Phone Number (optional)</label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      placeholder="+965 1234 5678"
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue rounded-2xl p-8">
                    <h3 className="font-bold text-xl mb-4">Listing Policy</h3>
                    <ul className="space-y-3 text-dark">
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✓</span>
                        All listings reviewed before going live
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✓</span>
                        Free: 4 listings, 3 photos max
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✓</span>
                        Premium: Unlimited listings, videos, featured spots
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-between mt-12">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-4 text-lg font-medium border border-gray-300 rounded-2xl hover:bg-gray-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="px-12 py-5 bg-green-600 text-white font-bold text-xl rounded-2xl hover:bg-green-700 transition shadow-2xl"
                    >
                      Submit Listing
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <div className="text-center py-24 px-8">
                <div className="w-40 h-40 mx-auto mb-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-6">
                  Listing Submitted!
                </h1>
                <p className="text-xl text-dark-4 mb-4">
                  Great job, <span className="font-bold text-blue">{contact.name.split(" ")[0] || "Pilot"}</span>!
                </p>
                <p className="text-xl text-dark-4 max-w-3xl mx-auto mb-12 leading-relaxed">
                  Your gear is under review and will appear on the shop page soon. 
                  We'll notify you via email when it's live or if we need more info.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <a
                    href="/shop-without-sidebar"
                    className="px-12 py-6 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-2xl"
                  >
                    Browse Shop →
                  </a>
                  <a
                    href="/sell"
                    className="px-12 py-6 border-2 border-blue text-blue font-bold text-xl rounded-2xl hover:bg-blue hover:text-white transition"
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