// src/components/Auth/Signin.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Security: Remove any email/password from URL immediately
  useEffect(() => {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.has("email") || params.has("password")) {
        router.replace("/signin"); // Cleaner way using Next.js router
      }
    }
  }, [router]);

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
    setLoading(true); // Optional: disable buttons during OAuth flow

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
        <div className="max-w-[570px] w/full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
              Sign In to PilotWardrobe
            </h2>
            <p>Welcome back, Captain!</p>
          </div>

          <form onSubmit={handleSignIn}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2.5">
                Email Address
              </label>
              <input
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



            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:bg-gray-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
               
             
              </button>
            </div>

            <p className="text-center mt-6">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </section>
  );
};

export default Signin;