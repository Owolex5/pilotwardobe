"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus full name field on mount
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/signin`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <section className="min-h-screen overflow-hidden pt-72 pb-36 lg:pt-54 lg:pb-32 bg-gray-2 flex items-center">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-6 sm:p-8 lg:p-11">
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl lg:text-heading-5 text-dark mb-1.5">
              Create Your PilotWardrobe Account
            </h2>
            <p className="text-base sm:text-lg">Join thousands of pilots buying and selling gear</p>
          </div>


          {success ? (
            <div className="text-center py-12 px-4">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-700">Check Your Inbox! ✈️</h3>
              <p className="text-gray-700 mb-2">We sent a confirmation link to</p>
              <p className="font-semibold text-lg text-blue-700 break-all">{email}</p>
              <p className="mt-6 text-gray-600 text-sm">
                Click the link in your email to verify your account, then sign in to access your dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignUp}>
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-dark">
                  Full Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Captain John Doe"
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-dark">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="captain@example.com"
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-dark">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters long
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-center mb-6 bg-red-50 py-3 rounded-lg text-sm">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 font-medium text-white bg-blue py-4 px-6 rounded-lg ease-out duration-200 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          <p className="text-center mt-8 text-gray-600 mb-4">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue font-semibold hover:underline">
              Sign In
            </Link>
          </p>

          {/* ← New: Secondary back button at the bottom */}
          <div className="text-center">
            <Link
              href="/marketplace"
              className="text-slate-500 hover:text-slate-700 text-sm font-medium underline underline-offset-4"
            >
              ← Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;