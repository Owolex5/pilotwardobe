"use client";

import React, { useState } from "react";
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <>
      {/* FIX: Added min-h-screen and flex to center the content.
        Updated pt-32 for mobile to clear the header. 
      */}
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
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Check your email!</h3>
                <p className="text-dark-4">We sent a confirmation link to</p>
                <p className="font-semibold mt-2">{email}</p>
              </div>
            ) : (
              <form onSubmit={handleSignUp}>
                <div className="mb-6">
                  <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-dark">
                    Full Name
                  </label>
                  <input
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

                <div className="mb-8">
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
                </div>

                {error && (
                  <p className="text-red-500 text-center mb-6 bg-red-50 py-3 rounded-lg text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-blue py-4 px-6 rounded-lg ease-out duration-200 hover:bg-opacity-90 disabled:opacity-70"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}

            <p className="text-center mt-8 text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;