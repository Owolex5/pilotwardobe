"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";  // ← ADD THIS LINE
import { CheckCircle, AlertCircle } from "lucide-react";

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Current logged-in user
  const router = useRouter();

  // Check auth state on mount + listen for changes
  useEffect(() => {
    // Initial check
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email) {
        setEmail(user.email); // Pre-fill email if logged in
      }
    };

    getUser();

    // Listen for auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setIsOpen(false); // Close accordion after success
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail("");
    // Optional: redirect or refresh checkout
    // router.refresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-8 text-left hover:bg-gray-50 transition duration-200"
      >
        <span className="font-semibold text-gray-900 text-lg">
          {user
            ? `Welcome back, ${user.user_metadata?.full_name || user.email?.split('@')[0]}`
            : "Have an account? Log in for faster checkout"}
        </span>
        <svg
          className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="px-8 pb-10 pt-4 border-t border-gray-200">
            {user ? (
              // === USER IS LOGGED IN ===
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    You're logged in!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {user.user_metadata?.full_name || "Captain"} • {user.email}
                  </p>

                  {/* Pre-fill checkout fields example */}
                  <div className="text-left text-sm text-gray-600 space-y-2">
                    <p><strong>Name:</strong> {user.user_metadata?.full_name || "—"}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Ready for checkout:</strong> Your details are pre-filled!</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-6 bg-red-50 text-red-700 font-medium rounded-xl hover:bg-red-100 transition"
                  >
                    Log Out
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                  >
                    Continue as {user.user_metadata?.full_name?.split(" ")[0] || "Guest"}
                  </button>
                </div>
              </div>
            ) : (
              // === USER IS NOT LOGGED IN ===
              <div className="space-y-6">
                <p className="text-gray-600 mb-6">
                  Log in to save your address, track orders, and enjoy faster checkout.
                </p>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@pilotwardrobe.com"
                      className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition"
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Logging in..." : "Log In"}
                  </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                    Sign up now
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;