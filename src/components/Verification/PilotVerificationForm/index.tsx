// components/Verification/PilotVerificationForm.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type VerificationStep = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "current" | "completed" | "failed";
};

type LicenseType = {
  country: string;
  authority: string;
  code: string;
};

interface PilotVerificationFormProps {
  userId: string;
}

const PilotVerificationForm = ({ userId }: PilotVerificationFormProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  // Verification steps
  const [steps, setSteps] = useState<VerificationStep[]>([
    { id: 1, title: "Account Authentication", description: "Verify your account details", status: "completed" },
    { id: 2, title: "Document Upload", description: "Upload pilot license & ID", status: "current" },
    { id: 3, title: "Facial Recognition", description: "Take a live photo", status: "pending" },
    { id: 4, title: "Information Verification", description: "Cross-check with aviation authorities", status: "pending" },
    { id: 5, title: "Approval", description: "Get verified status", status: "pending" },
  ]);

  // Upload states
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [facialPhoto, setFacialPhoto] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    licenseNumber: "",
    licenseCountry: "USA",
    licenseType: "ATP",
    expirationDate: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
  });

  // Supported countries and license types
  const countries: LicenseType[] = [
    { country: "United States", authority: "FAA", code: "USA" },
    { country: "Canada", authority: "Transport Canada", code: "CAN" },
    { country: "United Kingdom", authority: "CAA", code: "GBR" },
    { country: "European Union", authority: "EASA", code: "EU" },
    { country: "Australia", authority: "CASA", code: "AUS" },
    { country: "New Zealand", authority: "CAA NZ", code: "NZL" },
    { country: "Japan", authority: "JCAB", code: "JPN" },
    { country: "Singapore", authority: "CAAS", code: "SGP" },
    { country: "United Arab Emirates", authority: "GCAA", code: "UAE" },
    { country: "South Africa", authority: "SACAA", code: "ZAF" },
    { country: "India", authority: "DGCA", code: "IND" },
    { country: "Brazil", authority: "ANAC", code: "BRA" },
  ];

  const licenseTypes = [
    { value: "ATP", label: "Airline Transport Pilot (ATP)" },
    { value: "CPL", label: "Commercial Pilot License (CPL)" },
    { value: "PPL", label: "Private Pilot License (PPL)" },
    { value: "MPL", label: "Multi-crew Pilot License (MPL)" },
    { value: "ATPL", label: "Airline Transport Pilot License (ATPL)" },
    { value: "CFI", label: "Certified Flight Instructor (CFI)" },
  ];

  // Start camera for facial recognition
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCapturing(true);

        const updatedSteps = [...steps];
        updatedSteps[2].status = "current";
        setSteps(updatedSteps);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please ensure you've granted camera permissions.");
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL("image/png");
        setFacialPhoto(photoData);

        // Stop camera
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
          setIsCapturing(false);
        }

        const updatedSteps = [...steps];
        updatedSteps[2].status = "completed";
        updatedSteps[3].status = "current";
        setSteps(updatedSteps);
      }
    }
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "license" | "id") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG, or PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    if (type === "license") {
      setLicenseFile(file);
    } else {
      setIdFile(file);
    }

    // Update step status if both documents are uploaded
    if (licenseFile && idFile) {
      const updatedSteps = [...steps];
      updatedSteps[1].status = "completed";
      updatedSteps[2].status = "current";
      setSteps(updatedSteps);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!licenseFile || !idFile || !facialPhoto) {
      alert("Please complete all verification steps before submitting");
      return;
    }

    setStatus("uploading");

    const submissionData = new FormData();
    submissionData.append("licenseFile", licenseFile);
    submissionData.append("idFile", idFile);
    submissionData.append("facialPhoto", facialPhoto);
    submissionData.append("userId", userId);
    submissionData.append("formData", JSON.stringify(formData));

    try {
      const response = await fetch("/api/verify-pilot", {
        method: "POST",
        body: submissionData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const updatedSteps = [...steps];
        updatedSteps[3].status = "completed";
        updatedSteps[4].status = "completed";
        setSteps(updatedSteps);

        alert("Verification submitted successfully! You'll receive an email within 24-48 hours.");
      } else {
        throw new Error(result.error || "Failed to submit");
      }
    } catch (error) {
      console.error("Verification submission error:", error);
      alert("Error submitting verification. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const getStepIcon = (status: VerificationStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "current":
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
      case "failed":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Verification Process</h2>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />

        {/* Steps */}
        <div className="space-y-8 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-6">
              {/* Step indicator */}
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                  step.status === "completed"
                    ? "bg-green-50"
                    : step.status === "current"
                    ? "bg-blue-50"
                    : step.status === "failed"
                    ? "bg-red-50"
                    : "bg-gray-50"
                }`}
              >
                {getStepIcon(step.status)}
              </div>

              {/* Step content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Step {step.id}: {step.title}
                  </h3>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      step.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : step.status === "current"
                        ? "bg-blue-100 text-blue-800"
                        : step.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{step.description}</p>

                {/* Step 1 completed notice */}
                {step.id === 1 && step.status === "completed" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">
                      ✓ Account authenticated via email and phone verification
                    </p>
                  </div>
                )}

                {/* Step 2: Document Upload */}
                {step.id === 2 && step.status === "current" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Upload Documents</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* License Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h5 className="font-semibold text-gray-900 mb-2">Pilot License</h5>
                          <p className="text-sm text-gray-600 mb-4">
                            Upload front and back of your valid pilot license
                          </p>
                          <input
                            type="file"
                            id="license-upload"
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileUpload(e, "license")}
                          />
                          <label
                            htmlFor="license-upload"
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer"
                          >
                            {licenseFile ? "Change File" : "Upload License"}
                          </label>
                          {licenseFile && (
                            <p className="mt-3 text-sm text-green-600">✓ {licenseFile.name}</p>
                          )}
                        </div>

                        {/* ID Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h5 className="font-semibold text-gray-900 mb-2">Government ID</h5>
                          <p className="text-sm text-gray-600 mb-4">
                            Passport or driver's license for identity verification
                          </p>
                          <input
                            type="file"
                            id="id-upload"
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileUpload(e, "id")}
                          />
                          <label
                            htmlFor="id-upload"
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer"
                          >
                            {idFile ? "Change File" : "Upload ID"}
                          </label>
                          {idFile && <p className="mt-3 text-sm text-green-600">✓ {idFile.name}</p>}
                        </div>
                      </div>
                    </div>

                    {/* License Information Form */}
                    <div className="border-t pt-6">
                      <h4 className="font-medium text-gray-900 mb-4">License Information</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            License Number
                          </label>
                          <input
                            type="text"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 123456789"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Issuing Country
                          </label>
                          <select
                            value={formData.licenseCountry}
                            onChange={(e) => setFormData({ ...formData, licenseCountry: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.country} ({country.authority})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            License Type
                          </label>
                          <select
                            value={formData.licenseType}
                            onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {licenseTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiration Date
                          </label>
                          <input
                            type="date"
                            value={formData.expirationDate}
                            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Facial Recognition */}
                {step.id === 3 && step.status === "current" && (
                  <div className="space-y-6">
                    <h4 className="font-medium text-gray-900">Facial Recognition</h4>
                    <p className="text-gray-600">
                      We use facial recognition to match your photo with your ID document. This helps prevent fraud and ensures account security.
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      {!isCapturing ? (
                        <div className="text-center">
                          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-6">
                            Click below to start camera for facial recognition
                          </p>
                          <button
                            onClick={startCamera}
                            className="px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg"
                          >
                            Start Camera
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="relative bg-black rounded-xl overflow-hidden">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full h-auto"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={capturePhoto}
                              className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                            >
                              Capture Photo
                            </button>
                            <button
                              onClick={() => {
                                if (stream) {
                                  stream.getTracks().forEach((track) => track.stop());
                                  setStream(null);
                                  setIsCapturing(false);
                                }
                              }}
                              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {facialPhoto && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-green-800 font-medium">Photo captured successfully</span>
                            </div>
                            <button
                              onClick={() => setFacialPhoto(null)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Retake
                            </button>
                          </div>
                          <img
                            src={facialPhoto}
                            alt="Captured facial photo"
                            className="mt-4 w-32 h-32 object-cover rounded-lg mx-auto"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Privacy Note:</strong> Your facial data is encrypted and used only for verification. We comply with GDPR and other privacy regulations.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Personal Information */}
                {step.id === 4 && step.status === "current" && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nationality
                        </label>
                        <select
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Nationality</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.country}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={status === "uploading" || !licenseFile || !idFile || !facialPhoto}
          className="px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "uploading" ? "Submitting..." : "Submit Verification"}
        </button>

        <p className="text-gray-600 mt-6 text-sm">
          By submitting, you agree to our verification terms and confirm all information is accurate.
        </p>
      </div>
    </div>
  );
};

export default PilotVerificationForm;