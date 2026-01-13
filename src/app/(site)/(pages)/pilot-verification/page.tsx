// src/app/pilot-verification/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Camera, Upload, Shield, CheckCircle, XCircle, AlertCircle, Globe, Clock, User, X, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

// Type for verification steps
type VerificationStep = {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'failed';
};

// Type for supported licenses
type LicenseType = {
  country: string;
  authority: string;
  code: string;
};

const PilotVerification = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Verification steps
  const [steps, setSteps] = useState<VerificationStep[]>([
    { id: 1, title: "Account Authentication", description: "Verify your account details", status: 'completed' },
    { id: 2, title: "Document Upload", description: "Upload pilot license & ID", status: 'current' },
    { id: 3, title: "Facial Recognition", description: "Take a live photo", status: 'pending' },
    { id: 4, title: "Information Verification", description: "Cross-check with aviation authorities", status: 'pending' },
    { id: 5, title: "Approval", description: "Get verified status", status: 'pending' },
  ]);

  // Upload states
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [facialPhoto, setFacialPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
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

  // Effect to check when both files are uploaded and advance step
  useEffect(() => {
    if (licenseFile && idFile && formData.licenseNumber && formData.expirationDate) {
      const updatedSteps = [...steps];
      updatedSteps[1].status = 'completed';
      updatedSteps[2].status = 'current';
      setSteps(updatedSteps);
    }
  }, [licenseFile, idFile, formData.licenseNumber, formData.expirationDate]);

  // Effect to check when facial photo is captured
  useEffect(() => {
    if (facialPhoto) {
      const updatedSteps = [...steps];
      updatedSteps[2].status = 'completed';
      updatedSteps[3].status = 'current';
      setSteps(updatedSteps);
    }
  }, [facialPhoto]);

  // Start camera for facial recognition - IMPROVED VERSION
  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Try to get user media with constraints
      const constraints = {
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          facingMode: 'user',
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      setIsCapturing(true);
      
      // Set the video source
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(e => {
              console.error("Error playing video:", e);
              setCameraError("Could not start video playback");
            });
          }
        };
      }
      
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      setCameraError(getCameraErrorMessage(error));
      
      // Try fallback without constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        
        setStream(fallbackStream);
        setIsCapturing(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => {
                console.error("Error playing fallback video:", e);
              });
            }
          };
        }
        setCameraError(null);
      } catch (fallbackError) {
        console.error("Fallback camera access failed:", fallbackError);
      }
    }
  };

  // Helper function to get user-friendly camera error messages
  const getCameraErrorMessage = (error: any): string => {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return "Camera access denied. Please allow camera permissions in your browser settings.";
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return "No camera found. Please connect a camera and try again.";
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return "Camera is already in use by another application. Please close other apps using the camera.";
    } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      return "Camera doesn't support the requested settings. Trying alternative settings...";
    } else if (error.name === 'SecurityError') {
      return "Camera access blocked for security reasons. Make sure you're on HTTPS.";
    } else {
      return `Unable to access camera: ${error.message || 'Unknown error'}`;
    }
  };

  // Capture photo - IMPROVED VERSION
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Check if video is ready
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setCameraError("Camera is not ready yet. Please wait a moment.");
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw the current video frame onto canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
          // Convert canvas to data URL (JPEG for better compression)
          const photoData = canvas.toDataURL('image/jpeg', 0.92);
          setFacialPhoto(photoData);
          
          // Stop camera
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
          setIsCapturing(false);
          
        } catch (error) {
          console.error("Error capturing photo:", error);
          setCameraError("Error capturing photo. Please try again.");
        }
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCapturing(false);
      setCameraError(null);
    }
  };

  // Restart camera
  const restartCamera = () => {
    stopCamera();
    setTimeout(() => startCamera(), 100);
  };

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'id') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or PDF file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    if (type === 'license') {
      setLicenseFile(file);
    } else {
      setIdFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!licenseFile || !idFile || !facialPhoto) {
      alert("Please complete all verification steps before submitting");
      return;
    }

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.nationality) {
      alert("Please fill in all personal information fields");
      return;
    }

    // Create FormData for API submission
    const submissionData = new FormData();
    submissionData.append('licenseFile', licenseFile);
    submissionData.append('idFile', idFile);
    submissionData.append('facialPhoto', facialPhoto);
    submissionData.append('formData', JSON.stringify(formData));

    try {
      // In a real app, you would send this to your backend
      console.log("Submitting verification data:", {
        licenseFile: licenseFile.name,
        idFile: idFile.name,
        formData,
        facialPhotoLength: facialPhoto.length
      });
      
      // Simulate API processing with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update steps to show approval
      const updatedSteps = [...steps];
      updatedSteps[3].status = 'completed';
      updatedSteps[4].status = 'completed';
      setSteps(updatedSteps);
      
      // Show success message
      alert("Verification submitted successfully! You'll receive an email within 24-48 hours.");
      
      // In a real app, you might redirect to a success page
      // router.push('/verification-success');
      
    } catch (error) {
      console.error("Verification submission error:", error);
      alert("Error submitting verification. Please try again.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Effect to handle video element updates
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const getStepIcon = (status: VerificationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />;
    }
  };

  return (
    <>
      <Breadcrumb title="Pilot Verification" pages={["Home", "Verification"]} />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Pilot Verification
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete verification to unlock premium features, sell items, and join our trusted community of aviation professionals.
            </p>
          </div>

          {/* Verification Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Verification Process</h2>
            
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>
              
              {/* Steps */}
              <div className="space-y-8 relative z-10">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-6">
                    {/* Step indicator */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-50' :
                      step.status === 'current' ? 'bg-blue-50' :
                      step.status === 'failed' ? 'bg-red-50' : 'bg-gray-50'
                    }`}>
                      {getStepIcon(step.status)}
                    </div>
                    
                    {/* Step content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Step {step.id}: {step.title}
                        </h3>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                          step.status === 'completed' ? 'bg-green-100 text-green-800' :
                          step.status === 'current' ? 'bg-blue-100 text-blue-800' :
                          step.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      {/* Step-specific content */}
                      {step.id === 1 && step.status === 'completed' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800">
                            ✓ Account authenticated via email and phone verification
                          </p>
                        </div>
                      )}
                      
                      {step.id === 2 && step.status === 'current' && (
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
                                  onChange={(e) => handleFileUpload(e, 'license')}
                                />
                                <label
                                  htmlFor="license-upload"
                                  className="inline-block px-6 py-3 bg-blue-600 text-blue font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer"
                                >
                                  {licenseFile ? 'Change File' : 'Upload License'}
                                </label>
                                {licenseFile && (
                                  <p className="mt-3 text-sm text-green-600">
                                    ✓ {licenseFile.name}
                                  </p>
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
                                  onChange={(e) => handleFileUpload(e, 'id')}
                                />
                                <label
                                  htmlFor="id-upload"
                                  className="inline-block px-6 py-3 bg-blue-600 text-blue font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer"
                                >
                                  {idFile ? 'Change File' : 'Upload ID'}
                                </label>
                                {idFile && (
                                  <p className="mt-3 text-sm text-green-600">
                                    ✓ {idFile.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* License Information Form */}
                          <div className="border-t pt-6">
                            <h4 className="font-medium text-gray-900 mb-4">License Information</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  License Number *
                                </label>
                                <input
                                  type="text"
                                  value={formData.licenseNumber}
                                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
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
                                  onChange={(e) => setFormData({...formData, licenseCountry: e.target.value})}
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
                                  onChange={(e) => setFormData({...formData, licenseType: e.target.value})}
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
                                  Expiration Date *
                                </label>
                                <input
                                  type="date"
                                  value={formData.expirationDate}
                                  onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  required
                                />
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">
                              * Required fields to advance to next step
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {step.id === 3 && step.status === 'current' && (
                        <div className="space-y-6">
                          <h4 className="font-medium text-gray-900">Facial Recognition</h4>
                          <p className="text-gray-600">
                            We use facial recognition to match your photo with your ID document. This helps prevent fraud and ensures account security.
                          </p>
                          
                          <div className="bg-gray-50 rounded-2xl p-6">
                            {!isCapturing ? (
                              <div className="text-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <User className="w-12 h-12 text-gray-400" />
                                </div>
                                <p className="text-gray-600 mb-6">
                                  Click below to start camera for facial recognition
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                  <button
                                    onClick={startCamera}
                                    className="px-8 py-4 bg-blue-600 text-blue font-medium rounded-xl hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-3"
                                  >
                                    <Camera className="w-5 h-5" />
                                    Start Camera
                                  </button>
                                </div>
                                {cameraError && (
                                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">{cameraError}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {/* Camera Controls */}
                                <div className="flex justify-between items-center">
                                  <h5 className="font-medium text-gray-900">Camera Preview</h5>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={restartCamera}
                                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                      title="Restart Camera"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={stopCamera}
                                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                                      title="Close Camera"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Camera Preview */}
                                <div className="relative bg-black rounded-xl overflow-hidden">
                                  <div className="aspect-video relative">
                                    <video
                                      ref={videoRef}
                                      autoPlay
                                      playsInline
                                      muted
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        console.error("Video error:", e);
                                        setCameraError("Video stream error");
                                      }}
                                    />
                                    {/* Face overlay guide */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-64 h-64 border-2 border-white/30 rounded-full"></div>
                                    </div>
                                  </div>
                                  <canvas ref={canvasRef} className="hidden" />
                                </div>
                                
                                {/* Camera Status */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600">Camera is active</span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    Position your face within the circle
                                  </p>
                                </div>
                                
                                {/* Capture Button */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                  <button
                                    onClick={capturePhoto}
                                    className="flex-1 px-6 py-4 bg-green-600 text-blue font-medium rounded-xl hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-3"
                                  >
                                    <Camera className="w-5 h-5" />
                                    Capture Photo
                                  </button>
                                  <button
                                    onClick={stopCamera}
                                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                                
                                {cameraError && (
                                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm">{cameraError}</p>
                                    <button
                                      onClick={restartCamera}
                                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                      Try again
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {facialPhoto && !isCapturing && (
                              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    <div>
                                      <h5 className="text-green-800 font-medium">Photo captured successfully!</h5>
                                      <p className="text-green-600 text-sm">Your facial photo has been saved.</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setFacialPhoto(null);
                                      stopCamera();
                                    }}
                                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                                  >
                                    Retake Photo
                                  </button>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="relative">
                                    <img
                                      src={facialPhoto}
                                      alt="Captured facial photo"
                                      className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-blue p-2 rounded-full">
                                      <CheckCircle className="w-6 h-6" />
                                    </div>
                                  </div>
                                  <p className="text-gray-600 text-sm mt-4">
                                    Make sure your face is clearly visible and matches your ID document.
                                  </p>
                                </div>
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
                      
                      {step.id === 4 && step.status === 'current' && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name *
                              </label>
                              <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name *
                              </label>
                              <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth *
                              </label>
                              <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nationality *
                              </label>
                              <select
                                value={formData.nationality}
                                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
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
          </div>

          {/* Benefits Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Benefits of Being Verified
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Trust & Credibility</h3>
                <p className="text-gray-600 text-sm">
                  Verified badge shows you're a legitimate pilot, building trust with buyers and sellers.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Global Recognition</h3>
                <p className="text-gray-600 text-sm">
                  Verified across 100+ countries with ICAO-standard verification.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Priority Support</h3>
                <p className="text-gray-600 text-sm">
                  24/7 dedicated support line and faster dispute resolution for verified pilots.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!licenseFile || !idFile || !facialPhoto || !formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.nationality}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-blue font-bold text-xl rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Verification
            </button>
            
            <p className="text-gray-600 mt-6 text-sm">
              By submitting, you agree to our verification terms and confirm all information is accurate.
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Security & Privacy</h3>
            <ul className="text-gray-600 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                All documents are encrypted with AES-256 encryption and stored in secure, SOC2-compliant servers
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Facial recognition data is processed locally when possible and never shared with third parties
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                We comply with GDPR, CCPA, and aviation industry privacy standards
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Documents are automatically deleted 90 days after verification completion
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default PilotVerification;