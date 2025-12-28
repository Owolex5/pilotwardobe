// app/(site)/(pages)/SwapExchange/page.tsx - UPDATED VERSION
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase/client";

const SwapExchange = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

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
    category: "",
    condition: "",
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

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/signin");
    } else {
      setUser(user);
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", user.id)
        .single();

      if (profile) {
        setContact(prev => ({
          ...prev,
          name: profile.full_name || "",
          email: profile.email || user.email || "",
          phone: profile.phone || ""
        }));
      }
    }
  };

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

  const uploadImages = async (images: File[], userId: string) => {
    try {
      const uploadPromises = images.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}_${index}.${fileExt}`;
        const filePath = `swap-proposals/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('swap-proposals')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return null;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('swap-proposals')
          .getPublicUrl(filePath);

        return {
          url: publicUrl,
          alt: `Swap proposal image ${index + 1}`
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      return uploadedImages.filter(img => img !== null);
    } catch (error) {
      console.error("Storage upload error:", error);
      setStorageError("Failed to upload images. You can still submit without images.");
      return [];
    }
  };

const createSwapProposal = async (proposalData: any, images: File[]) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Upload images if any
    let uploadedImageUrls: string[] = [];
    if (images.length > 0) {
      for (const image of images) {
        const fileName = `${Date.now()}_${image.name}`;
        const { data, error } = await supabase.storage
          .from("swap-images")
          .upload(fileName, image);

        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from("swap-images")
          .getPublicUrl(fileName);
        
        uploadedImageUrls.push(publicUrl);
      }
    }

    // Create the swap proposal
    const proposalDataToInsert = {
      user_id: user.id,
      title: proposalData.yourItem.title,
      category: proposalData.yourItem.category,
      condition: proposalData.yourItem.condition,
      description: proposalData.yourItem.description,
      images: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
      status: "pending",
      // Required wanted item fields
      wanted_item_title: proposalData.wantedItem.title,
      wanted_item_category: proposalData.wantedItem.category,
      wanted_item_condition: proposalData.wantedItem.condition,
      wanted_item_description: proposalData.wantedItem.description,
    };

    console.log("Inserting proposal with data:", proposalDataToInsert);

    const { data: proposal, error } = await supabase
      .from("swap_proposals")
      .insert(proposalDataToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating swap proposal:", error);
      
      // If there's a column issue, try a simpler insert
      if (error.message?.includes('column') && error.message?.includes('does not exist')) {
        console.log("Trying alternative insert...");
        
        const { data: altProposal, error: altError } = await supabase
          .from("swap_proposals")
          .insert({
            user_id: user.id,
            title: proposalData.yourItem.title,
            category: proposalData.yourItem.category,
            condition: proposalData.yourItem.condition,
            description: `${proposalData.yourItem.description}\n\nLooking for: ${proposalData.wantedItem.title}`,
            status: "pending",
            // Still need the required field
            wanted_item_title: proposalData.wantedItem.title || "Item wanted",
            // Include other wanted fields if they exist in proposalData
            wanted_item_category: proposalData.wantedItem.category,
            wanted_item_condition: proposalData.wantedItem.condition,
            wanted_item_description: proposalData.wantedItem.description,
          })
          .select()
          .single();
          
        if (altError) {
          console.error("Alternative insert also failed:", altError);
          throw altError;
        }
        
        return altProposal;
      }
      
      throw error;
    }

    console.log("Proposal created successfully:", proposal);
      // Send notification to admin
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      try {
        await supabase
          .from("admin_notifications")
          .insert({
            type: "new_swap_proposal",
            title: "New Swap Proposal",
            message: `New swap proposal from ${userProfile?.full_name || "User"}: ${proposalData.yourItem.title}`,
            data: { 
              proposal_id: proposal.id, 
              user_id: user.id,
              user_name: userProfile?.full_name || proposalData.contact.name,
              user_email: userProfile?.email || proposalData.contact.email,
              category: proposalData.yourItem.category
            }
          });
      } catch (notifError) {
        console.warn("Failed to send notification:", notifError);
        // Continue even if notification fails
      }

      return proposal;
    } catch (error) {
      console.error("Error creating swap proposal:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!user) {
    router.push("/signin");
    return;
  }

  setLoading(true);
  setStorageError(null);
  
  try {
    // Validate required fields
    if (!yourItem.title || !yourItem.category || !yourItem.description) {
      throw new Error("Please fill in all required fields for your item.");
    }

    if (!wantedItem.title) {
      throw new Error("Please specify what you're looking for.");
    }

    if (!contact.name || !contact.email) {
      throw new Error("Please provide your contact information.");
    }

    // Get the images from your state (assuming you have an images state)
    // If you don't have images, pass an empty array
    const images: File[] = []; // Replace this with your actual images state
    
    // Create the swap proposal - now with 2 arguments
    const proposal = await createSwapProposal({ 
      yourItem, 
      wantedItem, 
      contact 
    }, images); // Add the images argument here
    
    if (proposal) {
      console.log("Swap Proposal Submitted:", { 
        proposal, 
        yourItem, 
        wantedItem, 
        contact 
      });
      
      // Save to localStorage for dashboard display
      try {
        const swapHistory = JSON.parse(localStorage.getItem('swapProposals') || '[]');
        swapHistory.push({
          id: proposal.id,
          title: yourItem.title,
          date: new Date().toISOString(),
          status: 'pending'
        });
        localStorage.setItem('swapProposals', JSON.stringify(swapHistory));
      } catch (storageError) {
        console.warn("Failed to save to localStorage:", storageError);
      }
      
      setStep(5);
    }
  } catch (error: any) {
    console.error("Submission failed:", error);
    
    // More specific error messages
    let errorMessage = "Failed to submit proposal. Please try again.";
    
    if (error.message?.includes('wanted_item_title')) {
      errorMessage = "Please provide what you're looking for in exchange.";
    } else if (error.message?.includes('null value')) {
      errorMessage = "Please fill in all required fields.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Breadcrumb title="Propose a Gear Swap" pages={["Home", "Swap/Exchange"]} />

      <section className="py-16 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          {/* Show storage error if any */}
          {storageError && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-700">{storageError}</p>
            </div>
          )}

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
                  onClick={() => {
                    if (!user) {
                      router.push("/signin");
                    } else {
                      handleNext();
                    }
                  }}
                  className="px-12 py-6 bg-blue text-white font-bold text-2xl rounded-2xl hover:bg-blue-dark transition shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Start Your Swap Proposal →"}
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
                      <span className="text-sm font-normal text-gray-500 ml-2">(Optional but recommended)</span>
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
                      disabled={!yourItem.title || !yourItem.category || !yourItem.description}
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

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-lg font-semibold text-dark mb-3">
                        Category (optional)
                      </label>
                      <select
                        value={wantedItem.category}
                        onChange={(e) => setWantedItem({ ...wantedItem, category: e.target.value })}
                        className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition bg-white"
                      >
                        <option value="">Any category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-dark mb-3">
                        Preferred Condition (optional)
                      </label>
                      <select
                        value={wantedItem.condition}
                        onChange={(e) => setWantedItem({ ...wantedItem, condition: e.target.value })}
                        className="w-full px-6 py-5 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/30 transition bg-white"
                      >
                        <option value="">Any condition</option>
                        {conditions.map((cond) => (
                          <option key={cond} value={cond.toLowerCase()}>
                            {cond}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-dark mb-3">
                      Preferences (optional)
                    </label>
                    <textarea
                      value={wantedItem.description}
                      onChange={(e) => setWantedItem({ ...wantedItem, description: e.target.value })}
                      rows={5}
                      placeholder="Preferred brand, model, color, features, etc."
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
                      className="px-10 py-5 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <h3 className="font-bold text-xl mb-4">How It Works</h3>
                    <ul className="space-y-3 text-dark">
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">1</span>
                        <div>
                          <strong>Submit Proposal:</strong> Your proposal goes into our matching system
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">2</span>
                        <div>
                          <strong>Admin Review:</strong> Our team reviews within 48 hours
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">3</span>
                        <div>
                          <strong>Match Found:</strong> We'll connect you with a compatible pilot
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">4</span>
                        <div>
                          <strong>Group Chat:</strong> Chat with your match and admin to finalize
                        </div>
                      </li>
                    </ul>
                  </div>

                  {storageError && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <p className="text-yellow-700">{storageError}</p>
                    </div>
                  )}

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
                      disabled={loading || !contact.name || !contact.email}
                      className="px-12 py-6 bg-green-600 text-white font-bold text-2xl rounded-2xl hover:bg-green-700 transition shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : "Submit Proposal"}
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
                  Your swap proposal has been received. Here's what happens next:
                </p>
                
                <div className="max-w-2xl mx-auto mb-12">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-2xl">
                      <div className="w-12 h-12 bg-blue text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                        1
                      </div>
                      <h4 className="font-bold text-lg mb-2">Admin Review</h4>
                      <p className="text-gray-600">Our team will review your proposal within 48 hours</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-2xl">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                        2
                      </div>
                      <h4 className="font-bold text-lg mb-2">Find Match</h4>
                      <p className="text-gray-600">We'll search for compatible pilots interested in your gear</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl">
                      <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                        3
                      </div>
                      <h4 className="font-bold text-lg mb-2">Group Chat</h4>
                      <p className="text-gray-600">Once matched, you'll get a group chat with admin support</p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-2xl">
                      <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                        4
                      </div>
                      <h4 className="font-bold text-lg mb-2">Finalize Swap</h4>
                      <p className="text-gray-600">Coordinate shipping/pickup through the chat</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/messages"
                    className="px-12 py-6 bg-blue text-white font-bold text-xl rounded-2xl hover:bg-blue-dark transition shadow-xl inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    View Messages
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-12 py-6 bg-gray-100 text-gray-800 font-bold text-xl rounded-2xl hover:bg-gray-200 transition inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      // Reset form
                      setYourItem({
                        title: "",
                        category: "",
                        condition: "excellent",
                        description: "",
                        images: [],
                      });
                      setWantedItem({
                        title: "",
                        description: "",
                        category: "",
                        condition: "",
                      });
                      setStep(1);
                    }}
                    className="px-12 py-6 border-2 border-blue text-blue font-bold text-xl rounded-2xl hover:bg-blue hover:text-white transition"
                  >
                    Propose Another Swap
                  </button>
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