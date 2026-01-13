// src/components/Shop/AIUniformRecommender.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // if using Next.js App Router

type UniformType = 'shirt' | 'pants' | 'jacket' | 'full-uniform';

interface MeasurementFields {
  label: string;
  key: keyof typeof initialMeasurements;
  placeholder: string;
  min?: number;
  max?: number;
}

const initialMeasurements = {
  height: '',
  weight: '',
  chest: '',
  waist: '',
  inseam: '',
  preferredFit: 'standard' as 'slim' | 'standard' | 'relaxed',
};

const measurementFieldsByType: Record<UniformType, MeasurementFields[]> = {
  shirt: [
    { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175', min: 150, max: 210 },
    { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 78', min: 50, max: 150 },
    { label: 'Chest (cm)', key: 'chest', placeholder: 'e.g. 98', min: 80, max: 140 },
  ],
  pants: [
    { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175', min: 150, max: 210 },
    { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 78', min: 50, max: 150 },
    { label: 'Waist (cm)', key: 'waist', placeholder: 'e.g. 82', min: 70, max: 130 },
    { label: 'Inseam (cm)', key: 'inseam', placeholder: 'e.g. 80', min: 65, max: 95 },
  ],
  jacket: [
    { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175', min: 150, max: 210 },
    { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 78', min: 50, max: 150 },
    { label: 'Chest (cm)', key: 'chest', placeholder: 'e.g. 98', min: 80, max: 140 },
    { label: 'Waist (cm)', key: 'waist', placeholder: 'e.g. 82', min: 70, max: 130 },
  ],
  'full-uniform': [
    { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175', min: 150, max: 210 },
    { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 78', min: 50, max: 150 },
    { label: 'Chest (cm)', key: 'chest', placeholder: 'e.g. 98', min: 80, max: 140 },
    { label: 'Waist (cm)', key: 'waist', placeholder: 'e.g. 82', min: 70, max: 130 },
    { label: 'Inseam (cm)', key: 'inseam', placeholder: 'e.g. 80', min: 65, max: 95 },
  ],
};

const AIUniformRecommender = () => {
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'measurements' | 'results'>('info');
  const [uniformType, setUniformType] = useState<UniformType>('shirt');
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [recommendation, setRecommendation] = useState<{
    size: string;
    confidence: number;
    reasoning: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset measurements when changing uniform type
  useEffect(() => {
    setMeasurements(initialMeasurements);
    setRecommendation(null);
  }, [uniformType]);

  const currentFields = measurementFieldsByType[uniformType] || [];

  const calculateSize = () => {
    setLoading(true);

    setTimeout(() => {
      const height = parseFloat(measurements.height) || 175;
      const weight = parseFloat(measurements.weight) || 75;
      const chest = parseFloat(measurements.chest) || 0;
      const waist = parseFloat(measurements.waist) || 0;
      const inseam = parseFloat(measurements.inseam) || 0;
      const bmi = weight / ((height / 100) ** 2);

      let size = 'M';
      const reasoning: string[] = [];

      // Base size mostly on primary measurements per type
      if (uniformType === 'shirt' || uniformType === 'jacket' || uniformType === 'full-uniform') {
        if (chest > 0) {
          if (chest < 92) size = 'S';
          else if (chest < 102) size = 'M';
          else if (chest < 112) size = 'L';
          else if (chest < 122) size = 'XL';
          else size = 'XXL';
          reasoning.push(`Chest ${chest} cm → base size ${size}`);
        } else {
          // Fallback to height if no chest
          if (height < 170) size = 'S';
          else if (height > 185) size = 'XL';
          else if (height > 178) size = 'L';
          reasoning.push(`Height ${height} cm (no chest provided)`);
        }
      }

      if (uniformType === 'pants' || uniformType === 'full-uniform') {
        if (waist > 0) {
          const waistInch = waist / 2.54;
          let pantSize = Math.round(waistInch);
          // Round to common even sizes
          pantSize = pantSize % 2 === 1 ? pantSize + 1 : pantSize;
          size = `${pantSize}`;
          reasoning.push(`Waist ${waist} cm ≈ size ${pantSize}`);
        }
        if (inseam > 0) {
          reasoning.push(`Inseam ${inseam} cm — consider length variants`);
        }
      }

      // Fit adjustments (apply last)
      if (measurements.preferredFit === 'slim') {
        if (size.startsWith('X')) size = 'L'; // rough downsize
        else if (size === 'L') size = 'M';
        else if (size === 'M') size = 'S';
        reasoning.push('Slim fit: size adjusted downward');
      } else if (measurements.preferredFit === 'relaxed') {
        if (size === 'S') size = 'M';
        else if (size === 'M') size = 'L';
        else if (size.startsWith('L')) size = 'XL';
        reasoning.push('Relaxed fit: size adjusted upward');
      }

      if (bmi > 27) {
        size = size === 'S' ? 'M' : size === 'M' ? 'L' : 'XL';
        reasoning.push('Higher BMI: size adjusted for comfort');
      }

      // Final confidence (higher if more measurements provided)
      const providedCount = [height, weight, chest, waist, inseam].filter(v => v > 0).length;
      const confidence = 0.75 + (providedCount * 0.05);

      setRecommendation({
        size,
        confidence: Math.min(0.98, confidence),
        reasoning,
      });
      setStep('results');
      setLoading(false);
    }, 1400);
  };

  const handleShopNow = () => {
    if (!recommendation) return;
    // Example: navigate to shop with size filter (adjust path/query as needed)
    router.push(`/shop?type=${uniformType}&size=${recommendation.size}`);
    // Alternative: call prop callback like onRecommend(recommendation.size)
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border border-blue-100">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-3">
          AI Pilot Uniform Size Recommender
        </h2>
        <p className="text-base sm:text-lg text-dark-4 max-w-2xl mx-auto">
          Personalized recommendation for pilot shirts, trousers, jackets or full uniform.
        </p>
      </div>

      {/* Step 1: Choose Type */}
      {step === 'info' && (
        <div className="space-y-6 sm:space-y-8">
          <p className="text-center text-dark-4 text-base sm:text-lg">
            Select the uniform part you're shopping for:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {(['shirt', 'pants', 'jacket', 'full-uniform'] as UniformType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setUniformType(type);
                  setStep('measurements');
                }}
                className={`p-6 sm:p-8 rounded-2xl border-4 transition-all duration-300 text-center font-semibold capitalize text-sm sm:text-base ${
                  uniformType === type
                    ? 'border-blue bg-blue text-white shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-blue hover:shadow-md'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Measurements */}
      {step === 'measurements' && (
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {currentFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-dark mb-2">{field.label}</label>
                <input
                  type="number"
                  value={measurements[field.key] ?? ''}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue focus:outline-none transition"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-3 sm:mb-4">Preferred Fit</label>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {(['slim', 'standard', 'relaxed'] as const).map((fit) => (
                <button
                  key={fit}
                  onClick={() => setMeasurements(prev => ({ ...prev, preferredFit: fit }))}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 font-medium capitalize transition text-sm sm:text-base ${
                    measurements.preferredFit === fit
                      ? 'border-blue bg-blue text-white'
                      : 'border-gray-300 bg-white hover:border-blue'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 sm:pt-6">
            <button
              onClick={() => setStep('info')}
              className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition w-full sm:w-auto"
            >
              Back to Selection
            </button>
            <button
              onClick={calculateSize}
              disabled={loading || !measurements.height.trim()}
              className="px-10 sm:px-12 py-4 bg-gradient-to-r from-blue to-blue-dark text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-3 justify-center w-full sm:w-auto"
            >
              {loading ? <>Calculating...</> : <>Get Recommendation →</>}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 'results' && recommendation && (
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h3 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              Recommended Size: <span className="text-blue text-4xl sm:text-5xl">{recommendation.size}</span>
            </h3>
            <div className="max-w-md mx-auto mb-6 sm:mb-8">
              <div className="flex items-center justify-between text-sm text-dark-4 mb-2">
                <span>Confidence</span>
                <span>{Math.round(recommendation.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue to-blue-dark h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${recommendation.confidence * 100}%` }}
                />
              </div>
            </div>
            <ul className="space-y-2 sm:space-y-3 text-left max-w-lg mx-auto text-sm sm:text-base">
              {recommendation.reasoning.map((reason, i) => (
                <li key={i} className="flex items-start gap-3 text-dark-4">
                  <span className="text-blue mt-1">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button
              onClick={() => setStep('measurements')}
              className="px-8 py-4 border-2 border-blue text-blue font-semibold rounded-xl hover:bg-blue hover:text-white transition w-full sm:w-auto"
            >
              Adjust Measurements
            </button>
            <button
              onClick={handleShopNow}
              className="px-10 sm:px-12 py-4 bg-blue text-white font-bold rounded-xl hover:bg-blue-dark transition w-full sm:w-auto"
            >
              Shop Size {recommendation.size} {uniformType.replace('-', ' ')}s →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIUniformRecommender;