"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromConfirmation, setFromConfirmation] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Check if user just confirmed their email
  useEffect(() => {
    const type = searchParams.get("type");
    const tokenHash = searchParams.get("token_hash");
    
    if (type === "signup" || tokenHash) {
      setFromConfirmation(true);
      
      // Clean the URL to remove confirmation parameters
      if (window.history.replaceState) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [searchParams]);

  // Auto-focus email field if coming from confirmation
  useEffect(() => {
    if (fromConfirmation && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [fromConfirmation]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <section className="min-h-screen overflow-hidden pt-72 pb-36 lg:pt-54 lg:pb-32 bg-gray-2 flex items-center">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
              {fromConfirmation ? "Welcome Aboard! ✈️" : "Sign In to PilotWardrobe"}
            </h2>
            <p>
              {fromConfirmation 
                ? "Your email has been confirmed. Please sign in to access your dashboard."
                : "Welcome back, Captain!"
              }
            </p>
          </div>

          {/* Success message after confirmation */}
          {fromConfirmation && (
            <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded text-green-800">
              <p className="font-medium">✅ Email confirmed successfully!</p>
              <p className="mt-1 text-sm">
                Your account is now active. Sign in with the email and password you used during registration.
              </p>
            </div>
          )}

          {/* ← New: Back to Marketplace button - prominent after confirmation */}
          <div className="mb-8 text-center">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition duration-200 border border-slate-200"
            >
           
              Home
            </Link>
          </div>

          <form onSubmit={handleSignIn}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2.5">
                Email Address
              </label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="captain@example.com"
                className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-2.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            {error && (
              <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-medium text-white bg-blue py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>



          <p className="text-center mt-6 mb-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          {/* ← New: Secondary back button near the bottom */}
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

export default Signin;