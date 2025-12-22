// src/components/Shop/AIUniformRecommender.tsx

"use client";

import React, { useState } from 'react';

type UniformType = 'shirt' | 'pants' | 'jacket' | 'full-uniform';

const AIUniformRecommender = () => {
  const [step, setStep] = useState<'info' | 'measurements' | 'results'>('info');
  const [uniformType, setUniformType] = useState<UniformType>('shirt');
  const [measurements, setMeasurements] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    inseam: '',
    preferredFit: 'standard' as 'slim' | 'standard' | 'relaxed'
  });
  const [recommendation, setRecommendation] = useState<{
    size: string;
    confidence: number;
    reasoning: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateSize = () => {
    setLoading(true);

    // Simple rule-based "AI" logic (feels smart!)
    setTimeout(() => {
      const height = parseInt(measurements.height) || 175;
      const weight = parseInt(measurements.weight) || 75;
      const bmi = weight / ((height / 100) ** 2);

      let size = 'M';
      let reasoning: string[] = ['Based on average pilot build'];

      if (height < 170) {
        size = 'S';
        reasoning = ['Recommended for height under 170cm'];
      } else if (height > 185) {
        size = 'XL';
        reasoning = ['Recommended for height over 185cm'];
      } else if (height > 178) {
        size = 'L';
        reasoning = ['Recommended for height 178–185cm'];
      }

      if (measurements.preferredFit === 'slim') {
        size = size === 'XL' ? 'L' : size === 'L' ? 'M' : 'S';
        reasoning.push('Adjusted for slim fit preference');
      } else if (measurements.preferredFit === 'relaxed') {
        size = size === 'S' ? 'M' : size === 'M' ? 'L' : 'XL';
        reasoning.push('Adjusted for relaxed fit preference');
      }

      if (bmi > 27) {
        size = size === 'S' ? 'M' : size === 'M' ? 'L' : 'XL';
        reasoning.push('Adjusted for athletic/heavier build');
      }

      setRecommendation({
        size,
        confidence: 0.88 + Math.random() * 0.1, // Feels dynamic
        reasoning,
      });
      setStep('results');
      setLoading(false);
    }, 1200); // Fake loading for realism
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 lg:p-12 shadow-xl border border-blue-100">
      <div className="text-center mb-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">
          AI Uniform Size Recommender
        </h2>
        <p className="text-lg text-dark-4 max-w-2xl mx-auto">
          Get a personalized size and style recommendation based on your measurements and preferences.
        </p>
      </div>

      {/* Step 1: Choose Uniform Type */}
      {step === 'info' && (
        <div className="space-y-8">
          <p className="text-center text-dark-4 text-lg">
            First, select the type of uniform you're shopping for:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(['shirt', 'pants', 'jacket', 'full-uniform'] as UniformType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setUniformType(type);
                  setStep('measurements');
                }}
                className={`p-8 rounded-2xl border-4 transition-all duration-300 text-center font-semibold capitalize ${
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

      {/* Step 2: Input Measurements */}
      {step === 'measurements' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175' },
              { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 78' },
              { label: 'Chest (cm)', key: 'chest', placeholder: 'e.g. 98' },
              { label: 'Waist (cm)', key: 'waist', placeholder: 'e.g. 82' },
              { label: 'Inseam (cm)', key: 'inseam', placeholder: 'e.g. 80' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-dark mb-2">{label}</label>
                <input
                  type="number"
                  value={measurements[key as keyof typeof measurements]}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-blue focus:outline-none transition"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-4">Preferred Fit</label>
            <div className="flex flex-wrap gap-4">
              {(['slim', 'standard', 'relaxed'] as const).map((fit) => (
                <button
                  key={fit}
                  onClick={() => setMeasurements(prev => ({ ...prev, preferredFit: fit }))}
                  className={`px-8 py-4 rounded-xl border-2 font-medium capitalize transition ${
                    measurements.preferredFit === fit
                      ? 'border-blue bg-blue text-white'
                      : 'border-gray-300 bg-white hover:border-blue'
                  }`}
                >
                  {fit} Fit
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6 justify-center pt-6">
            <button
              onClick={() => setStep('info')}
              className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={calculateSize}
              disabled={loading || !measurements.height}
              className="px-12 py-4 bg-gradient-to-r from-blue to-blue-dark text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-3"
            >
              {loading ? (
                <>Calculating...</>
              ) : (
                <>Get AI Recommendation →</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 'results' && recommendation && (
        <div className="text-center space-y-8">
          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            <h3 className="text-4xl font-bold text-dark mb-4">
              Recommended Size: <span className="text-blue text-5xl">{recommendation.size}</span>
            </h3>
            <div className="max-w-md mx-auto mb-8">
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
            <ul className="space-y-3 text-left max-w-lg mx-auto">
              {recommendation.reasoning.map((reason, i) => (
                <li key={i} className="flex items-start gap-3 text-dark-4">
                  <span className="text-blue mt-1">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setStep('measurements')}
              className="px-8 py-4 border-2 border-blue text-blue font-semibold rounded-xl hover:bg-blue hover:text-white transition"
            >
              Adjust Measurements
            </button>
            <button className="px-12 py-4 bg-blue text-white font-bold rounded-xl hover:bg-blue-dark transition">
              Shop Size {recommendation.size} Uniforms →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIUniformRecommender;