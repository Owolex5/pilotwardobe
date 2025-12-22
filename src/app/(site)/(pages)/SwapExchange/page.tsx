"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";  // ← Fixed path
import { useDropzone } from "react-dropzone";

const SwapExchange = () => {
  const [step, setStep] = useState(1); // 1: Intro, 2: Your Item, 3: Wanted Item, 4: Contact, 5: Success

  const [yourItem, setYourItem] = useState({
    title: "",
    category: "",
    condition: "excellent",
    description: "",
    images: [] as File[],
  });

  const [wantedItem, setWantedItem] = useState({
    title: "",
    description: "",
  });

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const categories = [
    "Headsets",
    "Uniforms",
    "Flight Bags",
    "Watches",
    "Kneeboards",
    "Sunglasses",
    "Logbooks",
    "Other",
  ];

  const conditions = ["Like New", "Excellent", "Good", "Fair"];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 6,
    onDrop: (acceptedFiles) => {
      setYourItem((prev) => ({
        ...prev,
        images: [...prev.images, ...acceptedFiles].slice(0, 6),
      }));
    },
  });

  const removeImage = (index: number) => {
    setYourItem((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
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
    // Future: Send to Supabase / email / admin dashboard
    console.log("Swap Proposal Submitted:", { yourItem, wantedItem, contact });
    setStep(5);
  };

  return (
    <>
      <Breadcrumb title="Propose a Gear Swap" pages={["Home", "Swap/Exchange"]} />

      <section className="py-16 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          {/* Progress Bar */}
          <div className="mb-16">
            <div className="flex items-center justify-between relative">
              {["Your Item", "Wanted Item", "Contact", "Submit"].map((label, i) => (
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
              {/* Connecting Lines */}
              <div className="absolute top-7 left-14 right-14 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-blue transition-all duration-500"
                  style={{ width: step >= 5 ? "100%" : `${((step - 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Step 1: Welcome Intro */}
            {step === 1 && (
              <div className="text-center py-20 px-8">
                <div className="w-36 h-36 mx-auto mb-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4 4m4-4l-4-4m0 12H4m0 0l4-4m-4 4l4 4" />
                  </svg>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-6">
                  Swap Your Pilot Gear
                </h1>
                <p className="text-xl text-dark-4 max-w-3xl mx-auto mb-12 leading-relaxed">
                  Trade your pre-owned aviation equipment with fellow pilots. 
                  Whether it's a headset, uniform, or flight bag — find your perfect match.
                  Our team carefully reviews and pairs compatible proposals.
                </p>
                <button
                  onClick={handleNext}
                  className="px-12 py-6 bg-blue text-white font-bold text-2xl rounded-2xl hover:bg-blue-dark transition shadow-2xl"
                >
                  Start Your Swap Proposal →
                </button>
              </div>
            )}

            {/* Step 2: Your Item */}
            {step === 2 && (
              <div className="p-8 lg:p-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-10">
                  What gear are you offering?
                </h2>

                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Item Title *
                    </label>
                    <input
                      type="text"
                      value={yourItem.title}
                      onChange={(e) => setYourItem({ ...yourItem, title: e.target.value })}
                      placeholder="e.g., Bose A20 Aviation Headset with Bluetooth"
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Category *
                    </label>
                    <select
                      value={yourItem.category}
                      onChange={(e) => setYourItem({ ...yourItem, category: e.target.value })}
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition bg-white"
                      required
                    >
                      <option value="">Choose a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Condition *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {conditions.map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setYourItem({ ...yourItem, condition: cond.toLowerCase() })}
                          className={`py-5 px-6 rounded-2xl font-medium text-lg border-2 transition shadow-md ${
                            yourItem.condition === cond.toLowerCase()
                              ? "border-blue bg-blue text-white shadow-blue/20"
                              : "border-gray-300 hover:border-blue"
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Description & Details *
                    </label>
                    <textarea
                      value={yourItem.description}
                      onChange={(e) => setYourItem({ ...yourItem, description: e.target.value })}
                      rows={6}
                      placeholder="Include age, usage, any wear, accessories included, original box, etc."
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Photos (up to 6) *
                    </label>
                    <div
                      {...getRootProps()}
                      className={`border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${
                        isDragActive ? "border-blue bg-blue-50" : "border-gray-300 hover:border-blue"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-xl font-medium text-dark">
                        {isDragActive ? "Drop photos here" : "Drag & drop photos or click to browse"}
                      </p>
                      <p className="text-dark-4 mt-2">Clear, well-lit images increase match chances!</p>
                    </div>

                    {yourItem.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                        {yourItem.images.map((file, i) => (
                          <div key={i} className="relative group rounded-2xl overflow-hidden shadow-lg">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${i + 1}`}
                              className="w-full aspect-square object-cover"
                            />
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute top-3 right-3 w-10 h-10 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-12">
                    <button
                      onClick={handleBack}
                      className="px-8 py-4 text-lg font-medium border border-gray-300 rounded-2xl hover:bg-gray-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!yourItem.title || !yourItem.category || yourItem.images.length === 0}
                      className="px-10 py-5 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Wanted Item */}
            {step === 3 && (
              <div className="p-8 lg:p-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-10">
                  What are you looking for in exchange?
                </h2>

                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Desired Item Title *
                    </label>
                    <input
                      type="text"
                      value={wantedItem.title}
                      onChange={(e) => setWantedItem({ ...wantedItem, title: e.target.value })}
                      placeholder="e.g., Lightspeed Zulu 3 Headset"
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Preferences (optional)
                    </label>
                    <textarea
                      value={wantedItem.description}
                      onChange={(e) => setWantedItem({ ...wantedItem, description: e.target.value })}
                      rows={5}
                      placeholder="Preferred brand, model, color, condition, features, etc."
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition resize-none"
                    />
                  </div>

                  <div className="flex justify-between mt-12">
                    <button
                      onClick={handleBack}
                      className="px-8 py-4 text-lg font-medium border border-gray-300 rounded-2xl hover:bg-gray-50 transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!wantedItem.title}
                      className="px-10 py-5 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-xl disabled:opacity-50"
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
                  Final Step: Your Contact Info
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-lg font-semibold text-dark mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        required
                        className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-dark mb-3">
                        Email Address *
                      </label>
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
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      placeholder="+965 1234 5678"
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Additional Notes (optional)
                    </label>
                    <textarea
                      value={contact.message}
                      onChange={(e) => setContact({ ...contact, message: e.target.value })}
                      rows={4}
                      placeholder="Location, urgency, shipping preferences..."
                      className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition resize-none"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue rounded-2xl p-8">
                    <h3 className="font-bold text-xl mb-4">Fair Swap Policy</h3>
                    <ul className="space-y-3 text-dark">
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✓</span>
                        All proposals reviewed within 48 hours
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✓</span>
                        We match based on value, condition & location
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-600 font-bold">!</span>
                        Unjustified rejections may pause swapping for 12 days
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
                      className="px-12 py-6 bg-green-600 text-white font-bold text-2xl rounded-2xl hover:bg-green-700 transition shadow-2xl"
                    >
                      Submit Proposal
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
                  Proposal Submitted Successfully!
                </h1>
                <p className="text-xl lg:text-2xl text-dark-4 mb-4">
                  Thank you, <span className="font-bold text-blue">{contact.name.split(" ")[0]}</span>!
                </p>
                <p className="text-xl text-dark-4 max-w-3xl mx-auto mb-12 leading-relaxed">
                  Your swap proposal has been received. Our team will review it and search for a matching pilot within 48 hours.
                  You’ll receive an email as soon as we find a potential match.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <a
                    href="/shop-without-sidebar"
                    className="px-12 py-6 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-xl"
                  >
                    Continue Shopping →
                  </a>
                  <a
                    href="/SwapExchange"
                    className="px-12 py-6 border-2 border-blue text-blue font-bold text-xl rounded-2xl hover:bg-blue hover:text-white transition"
                  >
                    Propose Another Swap
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

export default SwapExchange;